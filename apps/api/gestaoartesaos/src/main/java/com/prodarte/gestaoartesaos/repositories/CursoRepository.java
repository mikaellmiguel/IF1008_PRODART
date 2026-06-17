package com.prodarte.gestaoartesaos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.prodarte.gestaoartesaos.models.Curso;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
}
