package com.prodarte.gestaoartesaos.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodarte.gestaoartesaos.services.WhatsappService;

@RestController
@RequestMapping("/mensagens")
public class MensagemController {
    
    private final WhatsappService whatsappService;

    public MensagemController(WhatsappService whatsappService) {
        this.whatsappService = whatsappService;
    }
    
    @PostMapping("teste")
    public String enviarMensagemTeste() {
        whatsappService.enviarMensagem("558192629209", "Olá! Esta é uma mensagem de teste.");
        return "Mensagem de teste enviada com sucesso!";
    }
}
