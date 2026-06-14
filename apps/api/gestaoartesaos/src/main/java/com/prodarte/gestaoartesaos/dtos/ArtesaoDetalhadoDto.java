package com.prodarte.gestaoartesaos.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record ArtesaoDetalhadoDto(
    Long id,
    String nome,
    String cpf,
    String rg,
    LocalDateTime dataNascimento,
    String telefone,
    String email,
    
    // Endereço
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String uf,
    String cep,
    
    // Dados do Negócio
    String nomeMarca,
    String segmento,
    String descricaoProduto,
    String instagram,
    String categoriaProduto,
    boolean possuiMEI,
    String cnpj,
    String razaoSocial,
    
    // Status e datas
    String statusCuradoria,
    LocalDateTime dataInscricao,
    
    List<CuradoriaResumidaDto> curadorias,
    List<AlocacaoResumidaDto> alocacoes,
    List<DocumentoDto> documentos,
    List<MensagemResumidaDto> mensagens
    
) {}