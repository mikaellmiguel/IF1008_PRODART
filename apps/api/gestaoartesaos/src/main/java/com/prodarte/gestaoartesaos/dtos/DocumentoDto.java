package com.prodarte.gestaoartesaos.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentoDto(
    UUID id,
    String tipo,
    String url,
    String mimeType,
    Integer tamanhoBytes,
    LocalDateTime criadoEm
) {
    
}
