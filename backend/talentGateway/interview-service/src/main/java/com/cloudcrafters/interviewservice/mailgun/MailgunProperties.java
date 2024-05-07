package com.cloudcrafters.interviewservice.mailgun;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "mailgun")
@Configuration
public class MailgunProperties {
    private String apiKey;
    private String domain;
    private String fromEmail;
    // Getters and setters

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getFromEmail() {
        return fromEmail;
    }

    public void setFromEmail(String fromEmail) {
        this.fromEmail = fromEmail;
    }


    // Verification Des Parametres lors de Lancement de l'application
    @PostConstruct
    public void postConstruct() {
        System.out.println("API Key: " + this.apiKey);
        System.out.println("Domain: " + this.domain);
        System.out.println("Loaded From Email: " + fromEmail);
    }
}