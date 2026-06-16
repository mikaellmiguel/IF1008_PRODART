package com.prodarte.gestaoartesaos.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodarte.gestaoartesaos.dtos.EnviarMensagemRequest;
import com.prodarte.gestaoartesaos.services.WhatsappService;
import com.prodarte.gestaoartesaos.enums.TipoMensagem;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/mensagens")
public class MensagemController {
    
    private final WhatsappService whatsappService;

    public MensagemController(WhatsappService whatsappService) {
        this.whatsappService = whatsappService;
    }
    
    @GetMapping("/tipos")
    public ResponseEntity<Object> getTiposMensagem() {
        return ResponseEntity.ok(TipoMensagem.values());
    }

    @PostMapping("teste")
    public ResponseEntity<Object> enviarMensagemTeste(@Valid @RequestBody EnviarMensagemRequest request) {
        var resultado = whatsappService.enviarMensagem(request.numero(), request.mensagem());
        return ResponseEntity.status(resultado.enviado() ? 200 : 502).body(resultado);
    }
}
