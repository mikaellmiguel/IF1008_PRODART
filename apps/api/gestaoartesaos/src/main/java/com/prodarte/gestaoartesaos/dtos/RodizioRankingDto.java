package com.prodarte.gestaoartesaos.dtos;

import java.time.LocalDateTime;

/**
 * DTO que representa um artesão no ranking de rodízio.
 * Contém o score de justiça proporcional baseado no tempo de inatividade.
 */
public record RodizioRankingDto(
    long id,
    String nome,
    String nomeMarca,
    String segmento,
    String categoriaProduto,
    String telefone,
    String email,
    LocalDateTime ultimaAlocacao,
    long diasInativo,
    double scoreJustica,
    int posicao,
    boolean jaAlocadoNaFeira
) {}
