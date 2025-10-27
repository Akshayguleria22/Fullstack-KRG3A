package com.example.mentalhealth.service;

import com.example.mentalhealth.config.ChatCryptoProperties;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class CryptoService {
    private static final String ALG = "AES";
    private static final String CIPHER = "AES/GCM/NoPadding";
    private static final int GCM_TAG_BITS = 128;
    private static final int IV_BYTES = 12;

    private final SecretKey key;
    private final SecureRandom random = new SecureRandom();

    public CryptoService(ChatCryptoProperties props) {
        if (props.getBase64Key() == null || props.getBase64Key().isEmpty()) {
            // Generate an ephemeral key if none configured (DEV ONLY). In prod, require explicit key.
            this.key = generateKey();
        } else {
            byte[] k = Base64.getDecoder().decode(props.getBase64Key());
            this.key = new SecretKeySpec(k, ALG);
        }
    }

    private SecretKey generateKey() {
        try {
            KeyGenerator gen = KeyGenerator.getInstance(ALG);
            gen.init(256);
            return gen.generateKey();
        } catch (Exception e) {
            throw new IllegalStateException("Unable to generate AES key", e);
        }
    }

    public Enc encrypt(String plaintext) {
        try {
            byte[] iv = new byte[IV_BYTES];
            random.nextBytes(iv);
            Cipher cipher = Cipher.getInstance(CIPHER);
            cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] ct = cipher.doFinal(plaintext.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return new Enc(Base64.getEncoder().encodeToString(iv), Base64.getEncoder().encodeToString(ct));
        } catch (Exception e) {
            throw new IllegalStateException("Encryption failed", e);
        }
    }

    public String decrypt(String ivB64, String cipherTextB64) {
        try {
            byte[] iv = Base64.getDecoder().decode(ivB64);
            byte[] ct = Base64.getDecoder().decode(cipherTextB64);
            Cipher cipher = Cipher.getInstance(CIPHER);
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] pt = cipher.doFinal(ct);
            return new String(pt, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Decryption failed", e);
        }
    }

    public record Enc(String ivB64, String cipherTextB64) {}
}
