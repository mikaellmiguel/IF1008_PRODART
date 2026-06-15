package com.prodarte.gestaoartesaos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.prodarte.gestaoartesaos.models.Artesao;

public interface ArtesaoRepository extends JpaRepository<Artesao, Long>, JpaSpecificationExecutor<Artesao> {
    boolean existsByCpf(String cpf);
}
