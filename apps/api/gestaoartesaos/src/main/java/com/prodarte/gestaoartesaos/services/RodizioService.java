package com.prodarte.gestaoartesaos.services;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

import com.prodarte.gestaoartesaos.dtos.RodizioRankingDto;
import com.prodarte.gestaoartesaos.enums.StatusCuradoria;
import com.prodarte.gestaoartesaos.models.Artesao;
import com.prodarte.gestaoartesaos.repositories.AlocacaoRepository;
import com.prodarte.gestaoartesaos.repositories.ArtesaoRepository;

/**
 * Implementa o motor de rodízio justo do BPMN:
 * 1. Filtra base de artesãos aptos (status APROVADO)
 * 2. Calcula Score de Justiça Proporcional (dias de inatividade)
 * 3. Ordena ranking e indica vagas disponíveis
 *
 * O score é simples: quanto mais dias sem participar de uma feira,
 * maior a prioridade. Artesãos que nunca participaram recebem
 * prioridade máxima (score = Long.MAX_VALUE).
 */
@Service
public class RodizioService {

    private final ArtesaoRepository artesaoRepository;
    private final AlocacaoRepository alocacaoRepository;

    public RodizioService(ArtesaoRepository artesaoRepository, AlocacaoRepository alocacaoRepository) {
        this.artesaoRepository = artesaoRepository;
        this.alocacaoRepository = alocacaoRepository;
    }

    /**
     * Gera o ranking de rodízio para uma feira específica.
     *
     * @param feiraId UUID da feira para verificar alocações existentes
     * @return Lista de artesãos aprovados ordenados por score de justiça (decrescente)
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<RodizioRankingDto> gerarRanking(UUID feiraId) {
        // 1. Filtrar artesãos aptos (APROVADO)
        List<Artesao> aptos = artesaoRepository.findAll().stream()
                .filter(a -> a.getStatusCuradoria() == StatusCuradoria.APROVADO)
                .toList();

        // 2. Artesãos já alocados nesta feira
        var alocacoesExistentes = alocacaoRepository.findByFeiraId(feiraId);
        var idsJaAlocados = alocacoesExistentes.stream()
                .map(aloc -> aloc.getArtesao().getId())
                .toList();

        // 3. Calcular score e montar ranking
        LocalDateTime agora = LocalDateTime.now();
        List<RodizioRankingDto> ranking = new ArrayList<>();

        for (Artesao artesao : aptos) {
            LocalDateTime dataAlocacao = null;
            LocalDateTime dataFeiraFutura = null;
            LocalDateTime dataUltimoCurso = null;

            // 1. Find last completed course date
            var cursos = artesao.getCursos();
            if (cursos != null && !cursos.isEmpty()) {
                for (var curso : cursos) {
                    if (curso.getDataConclusao() != null) {
                        if (dataUltimoCurso == null || curso.getDataConclusao().isAfter(dataUltimoCurso)) {
                            dataUltimoCurso = curso.getDataConclusao();
                        }
                    }
                }
            }

            // 2. Find allocations details
            var alocacoes = artesao.getAlocacoes();
            boolean emQuarentena = false;
            boolean futuroBloqueado = false;
            LocalDateTime dataUltimaFeira = null;

            if (alocacoes != null) {
                for (var aloc : alocacoes) {
                    if (aloc.getFeira() != null && aloc.getFeira().getData() != null) {
                        LocalDateTime feiraData = aloc.getFeira().getData();
                        LocalDateTime criadaEm = aloc.getCriadaEm();

                        if (feiraData.isBefore(agora) || feiraData.isEqual(agora)) {
                            // Past fair
                            long diasDesdeFeira = ChronoUnit.DAYS.between(feiraData, agora);
                            if (diasDesdeFeira >= 0 && diasDesdeFeira < 7) {
                                emQuarentena = true;
                            }
                            if (dataUltimaFeira == null || feiraData.isAfter(dataUltimaFeira)) {
                                dataUltimaFeira = feiraData;
                            }
                            if (dataAlocacao == null || criadaEm.isAfter(dataAlocacao)) {
                                dataAlocacao = criadaEm;
                            }
                        } else {
                            // Future fair
                            long diasAteFeira = ChronoUnit.DAYS.between(agora, feiraData);
                            if (diasAteFeira >= 0 && diasAteFeira <= 15) {
                                futuroBloqueado = true;
                            }
                            if (dataFeiraFutura == null || feiraData.isBefore(dataFeiraFutura)) {
                                dataFeiraFutura = feiraData;
                            }
                        }
                    }
                }
            }

            long diasInativo;
            double dLast;

            if (dataAlocacao == null) {
                // Nunca participou — usar data de inscrição com offset
                LocalDateTime refDate = artesao.getDataInscricao() != null ? artesao.getDataInscricao() : agora;
                long diasReg = ChronoUnit.DAYS.between(refDate, agora);
                if (diasReg < 0) {
                    diasReg = 0;
                }
                diasInativo = Long.MAX_VALUE;
                dLast = (double) diasReg + 10000.0;
            } else {
                long diasDesdeAlocacao = ChronoUnit.DAYS.between(dataAlocacao, agora);
                if (diasDesdeAlocacao < 0) {
                    diasDesdeAlocacao = 0;
                }
                diasInativo = diasDesdeAlocacao;
                dLast = (double) diasDesdeAlocacao;
            }

            double bonus = 0.0;
            if (dataUltimoCurso != null) {
                double diasCurso = ChronoUnit.DAYS.between(dataUltimoCurso, agora);
                if (diasCurso < 0.0) {
                    diasCurso = 0.0;
                }
                double mCourse = diasCurso / 30.4375;
                if (mCourse <= 12.0) {
                    bonus = 20.0 * (12.0 - mCourse) / 12.0;
                }
            }

            double scoreJustica;
            if (emQuarentena || futuroBloqueado) {
                scoreJustica = 0.0;
            } else {
                scoreJustica = dLast + bonus;
            }

            boolean jaAlocado = idsJaAlocados.contains(artesao.getId());

            ranking.add(new RodizioRankingDto(
                    artesao.getId(),
                    artesao.getNome(),
                    artesao.getNomeMarca(),
                    artesao.getSegmento() != null ? artesao.getSegmento().name() : null,
                    artesao.getCategoriaProduto(),
                    artesao.getTelefone(),
                    artesao.getEmail(),
                    dataAlocacao,
                    diasInativo,
                    scoreJustica,
                    0, // posição será calculada após ordenação
                    jaAlocado,
                    dataAlocacao,
                    dataFeiraFutura,
                    dataUltimoCurso
            ));
        }

        // 4. Ordenar por score de justiça (maior score = maior prioridade)
        ranking.sort(Comparator.comparingDouble(RodizioRankingDto::scoreJustica).reversed());

        // 5. Atribuir posições
        AtomicInteger pos = new AtomicInteger(1);
        List<RodizioRankingDto> rankingFinal = ranking.stream()
                .map(r -> new RodizioRankingDto(
                        r.id(), r.nome(), r.nomeMarca(), r.segmento(),
                        r.categoriaProduto(), r.telefone(), r.email(),
                        r.ultimaAlocacao(), r.diasInativo(), r.scoreJustica(),
                        pos.getAndIncrement(), r.jaAlocadoNaFeira(),
                        r.dataAlocacao(), r.dataFeiraFutura(), r.dataUltimoCurso()
                ))
                .toList();

        return rankingFinal;
    }
}
