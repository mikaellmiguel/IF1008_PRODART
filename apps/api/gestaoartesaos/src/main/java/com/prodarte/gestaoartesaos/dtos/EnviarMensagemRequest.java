package com.prodarte.gestaoartesaos.dtos;

import jakarta.validation.constraints.NotBlank;

public record EnviarMensagemRequest(
    @NotBlank String numero,
    @NotBlank String mensagem
) {}
