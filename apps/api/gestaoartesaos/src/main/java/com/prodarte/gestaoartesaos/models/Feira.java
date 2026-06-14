package com.prodarte.gestaoartesaos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tb_feiras")
@Getter @Setter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Feira {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private LocalDateTime data;

    @Column(nullable = false)
    private String local;

    @Column(nullable = false)
    private Integer limiteVagas;

    @Column(nullable = false)
    private Integer vagasRestantes;

    @CreationTimestamp
    private LocalDateTime criadaEm;

    @UpdateTimestamp
    private LocalDateTime atualizadaEm;

    // Relação Bidirecional: Uma feira possui várias alocações
    @OneToMany(mappedBy = "feira", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Alocacao> alocacoes;
}
