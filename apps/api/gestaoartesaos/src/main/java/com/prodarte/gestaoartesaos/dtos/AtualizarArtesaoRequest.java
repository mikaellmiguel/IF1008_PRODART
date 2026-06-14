package com.prodarte.gestaoartesaos.dtos;

import java.time.LocalDateTime;

public record AtualizarArtesaoRequest(
    String nome,
    String rg,
    LocalDateTime dataNascimento,
    String cpf,
    String telefone,
    String email,
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String uf,
    String cep,
    String nomeMarca,
    String segmento, 
    String descricaoProduto,
    String instagram,
    String categoriaProduto,
    Boolean possuiMei,
    String cnpj,
    String razaoSocial
) {}