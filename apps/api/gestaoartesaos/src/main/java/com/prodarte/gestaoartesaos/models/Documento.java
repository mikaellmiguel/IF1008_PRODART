package com.prodarte.gestaoartesaos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.prodarte.gestaoartesaos.enums.TipoDocumento;

@Entity
@Table(name = "tb_documentos")
@Getter @Setter
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Relacionamento de volta para o Artesão (A chave estrangeira fica aqui)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artesao_id", nullable = false)
    private Artesao artesao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDocumento tipo;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String mimeType;

    @Column(nullable = false)
    private Integer tamanhoBytes;

    @CreationTimestamp
    private LocalDateTime criadoEm;
}