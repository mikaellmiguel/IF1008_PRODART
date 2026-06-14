package com.prodarte.gestaoartesaos.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Sort;

import com.prodarte.gestaoartesaos.dtos.ArtesaoFiltroDto;
import com.prodarte.gestaoartesaos.dtos.AtualizarArtesaoRequest;
import com.prodarte.gestaoartesaos.enums.Segmento;
import com.prodarte.gestaoartesaos.repositories.ArtesaoRepository;
import com.prodarte.gestaoartesaos.specifications.ArtesaoSpecification;

import jakarta.transaction.Transactional;


@RestController
@RequestMapping("/artesao")
public class ArtesaoController {


    private final ArtesaoRepository artesaoRepository;

    public ArtesaoController(ArtesaoRepository artesaoRepository) {
        this.artesaoRepository = artesaoRepository;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Object> getArtesao(@PathVariable Long id) {
        var artesao = artesaoRepository.findById(id);

        if (artesao.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(artesao.get());
    }

    @GetMapping("")
    public ResponseEntity<Object> getArtesoes(@ModelAttribute ArtesaoFiltroDto filtro, Sort sort) {
        var artesoes = artesaoRepository.findAll(ArtesaoSpecification.comFiltros(filtro), sort);
        return ResponseEntity.ok(artesoes);
    }

    @PatchMapping("/{id}")
    @Transactional
    public ResponseEntity<Object> atualizarArtesao(@PathVariable Long id, @RequestBody AtualizarArtesaoRequest request) {
        var artesaoOpt = artesaoRepository.findById(id);

        if (artesaoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var artesao = artesaoOpt.get();

        // Dados Pessoais
        if(request.nome() != null && !request.nome().isBlank()) artesao.setNome(request.nome());
        if(request.rg() != null && !request.rg().isBlank()) artesao.setRg(request.rg());
        if(request.dataNascimento() != null) artesao.setDataNascimento(request.dataNascimento());
        if(request.cpf() != null && !request.cpf().isBlank()) artesao.setCpf(request.cpf());
        if(request.telefone() != null && !request.telefone().isBlank()) artesao.setTelefone(request.telefone());
        if(request.email() != null && !request.email().isBlank()) artesao.setEmail(request.email());
        
        // Endereço
        if(request.logradouro() != null && !request.logradouro().isBlank()) artesao.setLogradouro(request.logradouro());
        if(request.numero() != null && !request.numero().isBlank()) artesao.setNumero(request.numero());
        if(request.complemento() != null && !request.complemento().isBlank()) artesao.setComplemento(request.complemento());
        if(request.bairro() != null && !request.bairro().isBlank()) artesao.setBairro(request.bairro());
        if(request.cidade() != null && !request.cidade().isBlank()) artesao.setCidade(request.cidade());
        if(request.uf() != null && !request.uf().isBlank()) artesao.setUf(request.uf());
        if(request.cep() != null && !request.cep().isBlank()) artesao.setCep(request.cep());

        // Dados do Negócio
        if(request.nomeMarca() != null && !request.nomeMarca().isBlank()) artesao.setNomeMarca(request.nomeMarca());
        if(request.descricaoProduto() != null && !request.descricaoProduto().isBlank()) artesao.setDescricaoProduto(request.descricaoProduto());
        if(request.instagram() != null && !request.instagram().isBlank()) artesao.setInstagram(request.instagram());
        if(request.categoriaProduto() != null && !request.categoriaProduto().isBlank()) artesao.setCategoriaProduto(request.categoriaProduto());

        if(request.segmento() != null && !request.segmento().isBlank()) artesao.setSegmento( Segmento.valueOf(request.segmento().toUpperCase()));

        // Formalização
        if(request.possuiMei() != null) artesao.setPossuiMEI(request.possuiMei());
        if(request.cnpj() != null && !request.cnpj().isBlank()) artesao.setCnpj(request.cnpj());
        if(request.razaoSocial() != null && !request.razaoSocial().isBlank()) artesao.setRazaoSocial(request.razaoSocial());

        artesaoRepository.save(artesao);

        return ResponseEntity.ok(artesao);
    }

}
