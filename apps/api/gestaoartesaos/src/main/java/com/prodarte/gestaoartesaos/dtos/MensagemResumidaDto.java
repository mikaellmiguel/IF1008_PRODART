package com.prodarte.gestaoartesaos.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record MensagemResumidaDto(
    UUID id,
    String conteudo,
    String assunto,
    String tipo,
    LocalDateTime enviadaEm,
    long artesaoId,
    long gestorId,
    String nomeArtesao,
    String nomeGestor
) {
    
}
