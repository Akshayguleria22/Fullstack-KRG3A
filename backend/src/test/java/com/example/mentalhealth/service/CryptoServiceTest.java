package com.example.mentalhealth.service;

import com.example.mentalhealth.config.ChatCryptoProperties;
import org.junit.jupiter.api.Test;

import java.util.Base64;
import java.security.SecureRandom;

import static org.junit.jupiter.api.Assertions.*;

public class CryptoServiceTest {
    @Test
    void roundTrip_encrypt_decrypt() {
        ChatCryptoProperties props = new ChatCryptoProperties();
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        props.setBase64Key(Base64.getEncoder().encodeToString(key));

        CryptoService crypto = new CryptoService(props);
        String msg = "Hello, encrypted world!";
        CryptoService.Enc enc = crypto.encrypt(msg);
        assertNotNull(enc.ivB64());
        assertNotNull(enc.cipherTextB64());
        String dec = crypto.decrypt(enc.ivB64(), enc.cipherTextB64());
        assertEquals(msg, dec);
    }
}
