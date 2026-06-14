package com.prodarte.gestaoartesaos.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.prodarte.gestaoartesaos.models.Alocacao;
import com.prodarte.gestaoartesaos.models.Artesao;
import com.prodarte.gestaoartesaos.models.Feira;

public interface AlocacaoRepository extends JpaRepository<Alocacao, UUID> {
    boolean existsByFeiraAndArtesao(Feira feira, Artesao artesao);
}
