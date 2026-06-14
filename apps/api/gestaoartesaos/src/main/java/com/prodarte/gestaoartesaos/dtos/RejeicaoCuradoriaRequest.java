package com.prodarte.gestaoartesaos.dtos;

import jakarta.validation.constraints.NotBlank;

public record RejeicaoCuradoriaRequest(
    @NotBlank(message = "A justificativa é obrigatória")
    String justificativa
) {}

