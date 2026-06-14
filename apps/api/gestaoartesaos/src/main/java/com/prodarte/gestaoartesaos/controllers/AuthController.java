package com.prodarte.gestaoartesaos.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;

import java.time.*;
import java.util.stream.Collectors;

import com.prodarte.gestaoartesaos.dtos.*;
import com.prodarte.gestaoartesaos.models.Role;
import com.prodarte.gestaoartesaos.repositories.UsuarioRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final JwtEncoder jwtEncoder;
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(JwtEncoder jwtEncoder, UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
        this.jwtEncoder = jwtEncoder;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest) {
        
        var user = usuarioRepository.findByEmail(loginRequest.email());
        
        if (user.isEmpty() || !user.get().isLoginCorrect(loginRequest.password(), passwordEncoder)) {
            return ResponseEntity.status(400).body(new AppError("Email ou senha incorretos"));
        }

        var now = Instant.now();
        var expiresIn = 3600L;


        var scopes = user.get().getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.joining(" "));

         var claims = JwtClaimsSet.builder()
            .issuer("gestaoartesaos-api")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiresIn))
            .subject(user.get().getEmail())
            .claim("scope", scopes)
            .build();

        var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return ResponseEntity.ok(new LoginResponse(jwtValue, expiresIn, user.get().getEmail(), user.get().getNome()));
    }
}
