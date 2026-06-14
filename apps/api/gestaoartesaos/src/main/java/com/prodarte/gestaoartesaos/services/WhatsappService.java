package com.prodarte.gestaoartesaos.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatsappService {
    
    @Value("${whatsapp.api.url}")
    private String apiUrl;
    @Value("${whatsapp.api.token}")
    private String apiToken;

    private final RestTemplate restTemplate;

    public WhatsappService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void enviarMensagem(String numero, String mensagem) {
        System.out.println("Enviando mensagem para " + numero + ": " + mensagem);
        // try{
        //     // Construir o payload da mensagem
        //     Map<String, Object> payload = new HashMap<>();
        //     payload.put("messaging_product", "whatsapp");
        //     payload.put("to", numero);
        //     payload.put("type", "text");
        //     Map<String, String> text = new HashMap<>();
        //     text.put("body", mensagem);
        //     payload.put("text", text);

        //     // Configurar os headers com o token de autenticação
        //     HttpHeaders headers = new HttpHeaders();
        //     headers.setContentType(MediaType.APPLICATION_JSON);
        //     headers.setBearerAuth(apiToken);

        //     HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        //     // Enviar a requisição POST para a API do WhatsApp
        //     var response = restTemplate.postForEntity(apiUrl, request, String.class);

        //     if(response.getStatusCode().is2xxSuccessful()) {
        //         System.out.println(response);
        //         System.out.println("Mensagem enviada com sucesso!");
        //     } else {
        //         System.err.println("Erro ao enviar mensagem: " + response.getStatusCode());
        //     }
        // }
        // catch(Exception e) {
        //     System.err.println("Erro de comunicação: " + e.getMessage());
        // }
    }
}
