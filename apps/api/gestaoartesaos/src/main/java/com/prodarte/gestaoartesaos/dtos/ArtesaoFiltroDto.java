package com.prodarte.gestaoartesaos.dtos;

public record ArtesaoFiltroDto(
    String nome,
    String email,
    String segmento,
    String telefone,
    String bairro,
    Boolean possuiMei,
    String statusCuradoria,
    String estado,
    String categoria
) {}