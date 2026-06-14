package com.prodarte.gestaoartesaos.dtos;

import java.time.LocalDateTime;

public record FeiraRequest(
    String nome,
    LocalDateTime data,
    String local,
    Integer limiteVagas
) {}
