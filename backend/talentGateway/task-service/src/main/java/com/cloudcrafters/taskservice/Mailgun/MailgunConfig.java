package com.cloudcrafters.taskservice.Mailgun;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MailgunConfig {
    @Value("${mailgun.api-key}")
    private String apiKey;

    @Value("${mailgun.domain}")
    private String domain;

    @Value("${mailgun.from-email}")
    private String fromEmail;

    public String getApiKey() {
        return apiKey;
    }

    public String getDomain() {
        return domain;
    }

    public String getFromEmail() {
        return fromEmail;
    }
}
