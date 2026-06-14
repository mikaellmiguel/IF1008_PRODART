package com.prodarte.gestaoartesaos.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.prodarte.gestaoartesaos.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
