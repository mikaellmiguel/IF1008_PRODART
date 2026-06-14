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
            var ultimaAlocacao = alocacaoRepository
                    .findTopByArtesaoOrderByCriadaEmDesc(artesao);

            long diasInativo;
            LocalDateTime dataUltimaAlocacao;

            if (ultimaAlocacao.isEmpty()) {
                // Nunca participou — prioridade máxima
                diasInativo = Long.MAX_VALUE;
                dataUltimaAlocacao = null;
            } else {
                dataUltimaAlocacao = ultimaAlocacao.get().getCriadaEm();
                diasInativo = ChronoUnit.DAYS.between(dataUltimaAlocacao, agora);
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
                    dataUltimaAlocacao,
                    diasInativo,
                    diasInativo == Long.MAX_VALUE ? Double.MAX_VALUE : (double) diasInativo,
                    0, // posição será calculada após ordenação
                    jaAlocado
            ));
        }

        // 4. Ordenar por score de justiça (maior inatividade = maior prioridade)
        ranking.sort(Comparator.comparingDouble(RodizioRankingDto::scoreJustica).reversed());

        // 5. Atribuir posições
        AtomicInteger pos = new AtomicInteger(1);
        List<RodizioRankingDto> rankingFinal = ranking.stream()
                .map(r -> new RodizioRankingDto(
                        r.id(), r.nome(), r.nomeMarca(), r.segmento(),
                        r.categoriaProduto(), r.telefone(), r.email(),
                        r.ultimaAlocacao(), r.diasInativo(), r.scoreJustica(),
                        pos.getAndIncrement(), r.jaAlocadoNaFeira()
                ))
                .toList();

        return rankingFinal;
    }
}
