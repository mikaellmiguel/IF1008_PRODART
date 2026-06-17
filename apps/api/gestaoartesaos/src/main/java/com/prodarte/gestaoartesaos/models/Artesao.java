package com.prodarte.gestaoartesaos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.prodarte.gestaoartesaos.enums.StatusCuradoria;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.prodarte.gestaoartesaos.enums.Segmento;

@Entity
@Table(name = "tb_artesaos")
@Getter @Setter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Artesao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // Dados Pessoais
    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    private String rg;
    private LocalDateTime dataNascimento;

    @Column(nullable = false)
    private String telefone;
    private String email;

    // Endereço
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private String cep;

    // Dados do Negócio
    private String nomeMarca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Segmento segmento;

    @Column(columnDefinition = "TEXT")
    private String descricaoProduto;

    private String instagram;
    private String categoriaProduto;
    // Formalização
    @Column(nullable = false, name = "possui_mei")
    private boolean possuiMEI = false;
    private String cnpj;
    private String razaoSocial;

    // Status e Datas
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCuradoria statusCuradoria = StatusCuradoria.EM_ANALISE;

    @CreationTimestamp
    private LocalDateTime dataInscricao;

    @UpdateTimestamp
    private LocalDateTime atualizadoEm;

    // Relações (Equivalente ao onDelete: Cascade do Prisma)
    @OneToMany(mappedBy = "artesao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Documento> documentos;

    @OneToMany(mappedBy = "artesao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Curadoria> curadorias;

    @OneToMany(mappedBy = "artesao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Alocacao> alocacoes;

    @OneToMany(mappedBy = "artesao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Mensagem> mensagens;

    @OneToMany(mappedBy = "artesao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Curso> cursos;
}