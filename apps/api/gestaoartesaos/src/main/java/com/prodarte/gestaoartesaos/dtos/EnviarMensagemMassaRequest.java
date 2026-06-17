package com.prodarte.gestaoartesaos.dtos;

import java.util.List;
import com.prodarte.gestaoartesaos.enums.TipoMensagem;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record EnviarMensagemMassaRequest(
    @NotEmpty(message = "A lista de artesãos destinatários não pode estar vazia.")
    List<Long> artesaoIds,

    @NotEmpty(message = "O assunto não pode estar vazio.")
    String assunto,

    @NotEmpty(message = "O conteúdo não pode estar vazio.")
    String conteudo,

    @NotNull(message = "O tipo de mensagem deve ser informado.")
    TipoMensagem tipo
) {}
