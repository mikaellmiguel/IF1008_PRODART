package com.prodarte.gestaoartesaos.controllers;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodarte.gestaoartesaos.dtos.CriarUsuarioDto;
import com.prodarte.gestaoartesaos.repositories.UsuarioRepository;
import com.prodarte.gestaoartesaos.repositories.RoleRepository;
import com.prodarte.gestaoartesaos.models.*;
import jakarta.transaction.Transactional;


@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    
    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepository, RoleRepository roleRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @PostMapping("")
    public ResponseEntity<Void> criarUsuario(@RequestBody CriarUsuarioDto usuario) {
        var basicRole = roleRepository.findByName(Role.Values.BASIC.name().toLowerCase());
        
        if (usuarioRepository.findByEmail(usuario.email()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        
        var user = new Usuario();
        user.setNome(usuario.name());
        user.setEmail(usuario.email());
        user.setSenha(passwordEncoder.encode(usuario.password()));
        user.setTelefone(usuario.telefone());

        user.setRoles(Set.of(basicRole));
        usuarioRepository.save(user);

        return ResponseEntity.ok().build();
    }


}
