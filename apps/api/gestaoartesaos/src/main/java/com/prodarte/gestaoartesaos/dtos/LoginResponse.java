package com.prodarte.gestaoartesaos.dtos;

public record LoginResponse (String accessToken, long expiresIn, String email, String nome) {
    
}
