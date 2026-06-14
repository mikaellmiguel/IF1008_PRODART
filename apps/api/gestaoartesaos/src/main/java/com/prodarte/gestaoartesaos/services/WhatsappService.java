package com.prodarte.gestaoartesaos.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.prodarte.gestaoartesaos.dtos.WhatsappEnvioResponse;

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

    public WhatsappEnvioResponse enviarMensagem(String numero, String mensagem) {
        var numeroNormalizado = normalizarNumero(numero);

        Map<String, Object> payload = new HashMap<>();
        payload.put("messaging_product", "whatsapp");
        payload.put("to", numeroNormalizado);
        payload.put("type", "text");

        Map<String, String> text = new HashMap<>();
        text.put("body", mensagem);
        payload.put("text", text);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiToken);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            boolean sucesso = response.getStatusCode().is2xxSuccessful();
            String detalhe = response.getBody() != null ? response.getBody() : response.getStatusCode().toString();

            if (sucesso) {
                System.out.println("WhatsApp enviado para " + numeroNormalizado + ": " + detalhe);
            } else {
                System.err.println("WhatsApp retornou erro para " + numeroNormalizado + ": " + detalhe);
            }

            return new WhatsappEnvioResponse(sucesso, response.getStatusCode().value(), detalhe);
        } catch (RestClientException e) {
            System.err.println("Erro ao enviar WhatsApp para " + numeroNormalizado + ": " + e.getMessage());
            return new WhatsappEnvioResponse(false, 0, e.getMessage());
        }
    }

    private String normalizarNumero(String numero) {
        return numero == null ? "" : numero.replaceAll("\\D", "");
    }
}
