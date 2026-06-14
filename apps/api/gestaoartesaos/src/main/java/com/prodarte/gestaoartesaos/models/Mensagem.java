package com.prodarte.gestaoartesaos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.prodarte.gestaoartesaos.enums.TipoMensagem;

@Entity
@Table(name = "tb_mensagens")
@Getter @Setter
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String assunto;
    // nullable = true (Omitido o nullable = false pois é o padrão)
    // Se for mensagem do sistema (automática), o gestor fica null.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gestor_id")
    @JsonIncludeProperties({"id", "nome", "email", "telefone"})
    private Usuario gestor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMensagem tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artesao_id", nullable = false)
    @JsonIncludeProperties({"id", "nome", "nomeMarca", "segmento", "categoria", "telefone", "email", "categoriaProduto"})
    private Artesao artesao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @CreationTimestamp
    private LocalDateTime enviadaEm;
}