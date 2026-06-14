package com.prodarte.gestaoartesaos.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record CuradoriaResumidaDto(
    UUID id,
    String justificativa,
    String status,
    LocalDateTime criadaEm,
    long artesaoId,
    long gestorId,
    String nomeArtesao,
    String nomeGestor
) { }
