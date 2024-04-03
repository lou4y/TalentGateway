package com.cloudcrafters.messagingservice.entities;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.*;
import javax.crypto.*;
import javax.crypto.spec.*;
import java.security.*;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class ChatMessage {
    @Id
    private String id;
    private String chatId;
    private String senderId;
    private String recipientId;
    private String content; // Content will be encrypted when stored in the database
    private Date timestamp;

    // Encryption and Decryption Methods
    private static final String SECRET_KEY = "mysecret19992209"; // Change this to your secret key
    private static final byte[] IV = new byte[16]; // Initialization vector for AES

    public static String encrypt(String content) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
            IvParameterSpec ivSpec = generateIV();
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
            byte[] encrypted = cipher.doFinal(content.getBytes());
            byte[] combined = new byte[ivSpec.getIV().length + encrypted.length];
            System.arraycopy(ivSpec.getIV(), 0, combined, 0, ivSpec.getIV().length);
            System.arraycopy(encrypted, 0, combined, ivSpec.getIV().length, encrypted.length);
            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String decrypt(String encryptedContent) {
        try {
            if (encryptedContent == null || encryptedContent.isEmpty()) {
                return null; // Return null if the encrypted content is null or empty
            }

            byte[] combined = Base64.getDecoder().decode(encryptedContent);
            byte[] ivBytes = Arrays.copyOfRange(combined, 0, 16);
            byte[] encrypted = Arrays.copyOfRange(combined, 16, combined.length);

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
            byte[] decrypted = cipher.doFinal(encrypted);

            return new String(decrypted);
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException
                 | InvalidAlgorithmParameterException | IllegalBlockSizeException
                 | BadPaddingException e) {
            e.printStackTrace();
            return null;
        }
    }

    private static IvParameterSpec generateIV() {
        SecureRandom random = new SecureRandom();
        byte[] iv = new byte[16];
        random.nextBytes(iv);
        return new IvParameterSpec(iv);
    }

}

