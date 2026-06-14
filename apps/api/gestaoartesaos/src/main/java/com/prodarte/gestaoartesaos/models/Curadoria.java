package com.prodarte.gestaoartesaos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.prodarte.gestaoartesaos.enums.StatusCuradoria;

@Entity
@Table(name = "tb_curadorias")
@Getter @Setter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Curadoria {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artesao_id", nullable = false)
    @JsonIncludeProperties({"id", "nome", "nomeMarca", "segmento", "categoria", "telefone", "email", "categoriaProduto"})
    private Artesao artesao;

    // Assumindo que você tem uma classe Gestor (ou Usuario com role de Gestor)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gestor_id", nullable = false)
    @JsonIncludeProperties({"id", "nome", "email", "telefone"})
    private Usuario gestor; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCuradoria status;

    // Justificativa pode ser grande, então usamos TEXT no banco de dados
    @Column(columnDefinition = "TEXT")
    private String justificativa;

    @CreationTimestamp
    private LocalDateTime criadaEm;
}