package com.prodarte.gestaoartesaos.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prodarte.gestaoartesaos.models.Mensagem;

public interface MensagemRepository extends JpaRepository<Mensagem, UUID> {
}
