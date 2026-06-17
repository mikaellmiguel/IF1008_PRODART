package com.prodarte.gestaoartesaos.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.prodarte.gestaoartesaos.dtos.WhatsappEnvioResponse;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WhatsappService {

    private static final Logger logger = LoggerFactory.getLogger(WhatsappService.class);

    @Value("${twilio.whatsapp-number}")
    private String senderWhatsappNumber;

    public WhatsappEnvioResponse enviarMensagem(String numero, String mensagem) {
        String numeroDestino = normalizarNumero(numero);
        if (numeroDestino.isEmpty()) {
            logger.error("Falha ao enviar mensagem: número de destino vazio");
            return new WhatsappEnvioResponse(false, 400, "Número de destino inválido ou vazio");
        }

        try {
            Message message = Message.creator(
                new PhoneNumber(numeroDestino),
                new PhoneNumber(senderWhatsappNumber),
                mensagem
            ).create();

            logger.info("Mensagem WhatsApp enviada com sucesso para {}. SID: {}", numeroDestino, message.getSid());
            return new WhatsappEnvioResponse(true, 200, "Enviado com sucesso. SID: " + message.getSid());
        } catch (Exception e) {
            logger.error("Erro ao enviar mensagem WhatsApp via Twilio para {}: {}", numeroDestino, e.getMessage(), e);
            return new WhatsappEnvioResponse(false, 500, e.getMessage());
        }
    }

    private String normalizarNumero(String numero) {
        if (numero == null) {
            return "";
        }
        String apenasDigitos = numero.replaceAll("\\D", "");
        if (apenasDigitos.isEmpty()) {
            return "";
        }

            // Brasil: 55 + DDD + 9 + 8 dígitos = 13 dígitos
        if (apenasDigitos.startsWith("55")
                && apenasDigitos.length() == 13
                && apenasDigitos.charAt(4) == '9') {

            apenasDigitos =
                    apenasDigitos.substring(0, 4) +
                    apenasDigitos.substring(5);
        }
        // Twilio requires WhatsApp destination format: "whatsapp:+[country_code][area_code][number]"
        return "whatsapp:+" + apenasDigitos;
    }
}
