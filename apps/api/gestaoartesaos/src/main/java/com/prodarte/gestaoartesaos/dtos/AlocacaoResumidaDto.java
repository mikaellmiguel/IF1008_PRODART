package com.prodarte.gestaoartesaos.dtos;
import java.time.LocalDateTime;
import java.util.UUID;

public record AlocacaoResumidaDto(
    UUID id,
    UUID feiraId,
    String nomeFeira,
    LocalDateTime criadaEm,
    LocalDateTime dataFeira,
    String status
) {}