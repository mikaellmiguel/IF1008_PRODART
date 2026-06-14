package com.prodarte.gestaoartesaos.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;

public record CriarArtesaoRequest(
    @NotBlank String nome,
    @NotBlank String cpf,
    String rg,
    LocalDateTime dataNascimento,
    @NotBlank String telefone,
    String email,
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String uf,
    String cep,
    String nomeMarca,
    @NotBlank String segmento,
    String descricaoProduto,
    String instagram,
    String categoriaProduto,
    Boolean possuiMei,
    String cnpj,
    String razaoSocial
) {}
