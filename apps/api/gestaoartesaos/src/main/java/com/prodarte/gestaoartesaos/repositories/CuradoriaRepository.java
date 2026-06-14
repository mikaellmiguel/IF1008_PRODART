package com.prodarte.gestaoartesaos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.prodarte.gestaoartesaos.models.Curadoria;
import java.util.UUID;

public interface CuradoriaRepository extends JpaRepository<Curadoria, UUID> {
    
}
