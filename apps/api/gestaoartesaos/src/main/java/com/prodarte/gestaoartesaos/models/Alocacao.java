package com.prodarte.gestaoartesaos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.prodarte.gestaoartesaos.enums.StatusAlocacao;

@Entity
@Table(name = "tb_alocacoes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"artesao_id", "feira_id"})
})
@Getter @Setter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Alocacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artesao_id", nullable = false)
    @JsonIncludeProperties({"id", "nome", "nomeMarca", "segmento", "categoria", "telefone", "email", "categoriaProduto"})
    private Artesao artesao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feira_id", nullable = false)
    @JsonIncludeProperties({"id", "nome", "data", "local", "limiteVagas", "vagasRestantes"})
    private Feira feira;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAlocacao status = StatusAlocacao.ALOCADO;

    @CreationTimestamp
    private LocalDateTime criadaEm;
}