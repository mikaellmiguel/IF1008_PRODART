package com.prodarte.gestaoartesaos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prodarte.gestaoartesaos.models.Role;


public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
