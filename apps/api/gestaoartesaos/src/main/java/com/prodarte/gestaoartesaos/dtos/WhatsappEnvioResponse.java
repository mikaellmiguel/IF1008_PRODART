package com.prodarte.gestaoartesaos.dtos;

public record WhatsappEnvioResponse(
    boolean enviado,
    int statusCode,
    String detalhe
) {}
