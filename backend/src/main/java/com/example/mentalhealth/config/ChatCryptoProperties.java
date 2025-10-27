package com.example.mentalhealth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.chat.crypto")
public class ChatCryptoProperties {
    /**
     * Base64-encoded 256-bit key for AES-GCM storage encryption.
     */
    private String base64Key;

    public String getBase64Key() {
        return base64Key;
    }

    public void setBase64Key(String base64Key) {
        this.base64Key = base64Key;
    }
}
