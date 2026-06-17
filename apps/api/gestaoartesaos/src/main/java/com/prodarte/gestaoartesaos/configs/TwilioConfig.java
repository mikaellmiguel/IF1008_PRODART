package com.prodarte.gestaoartesaos.configs;

import com.twilio.Twilio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class TwilioConfig {

    private static final Logger logger = LoggerFactory.getLogger(TwilioConfig.class);

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @PostConstruct
    public void initTwilio() {
        if (accountSid == null || accountSid.isBlank() || accountSid.contains("TWILIO_ACCOUNT_SID") ||
            authToken == null || authToken.isBlank() || authToken.contains("TWILIO_AUTH_TOKEN")) {
            logger.warn("Twilio configuration credentials are not set or are using default placeholders. Twilio SDK initialization skipped.");
        } else {
            try {
                Twilio.init(accountSid, authToken);
                logger.info("Twilio SDK initialized successfully with Account SID: {}", accountSid);
            } catch (Exception e) {
                logger.error("Failed to initialize Twilio SDK: {}", e.getMessage(), e);
            }
        }
    }
}
