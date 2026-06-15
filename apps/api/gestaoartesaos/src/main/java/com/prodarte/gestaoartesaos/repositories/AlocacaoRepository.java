package com.prodarte.gestaoartesaos.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.prodarte.gestaoartesaos.models.Alocacao;
import com.prodarte.gestaoartesaos.models.Artesao;
import com.prodarte.gestaoartesaos.models.Feira;

public interface AlocacaoRepository extends JpaRepository<Alocacao, UUID> {
    boolean existsByFeiraAndArtesao(Feira feira, Artesao artesao);

    /** Busca a alocação mais recente de um artesão (para calcular inatividade). */
    Optional<Alocacao> findTopByArtesaoOrderByCriadaEmDesc(Artesao artesao);

    /** Lista todas as alocações de uma feira específica. */
    List<Alocacao> findByFeiraId(UUID feiraId);
}
