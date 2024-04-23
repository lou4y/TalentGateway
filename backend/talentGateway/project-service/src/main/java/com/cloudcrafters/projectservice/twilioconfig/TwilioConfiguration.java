package com.cloudcrafters.projectservice.twilioconfig;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("twilio")
public class TwilioConfiguration {
    private String accountSid;
    private String authToken;
    private String trialNumber;

    public TwilioConfiguration() {
    }

    public String getAccountSid() {
        return this.accountSid;
    }

    public String getAuthToken() {
        return this.authToken;
    }

    public String getTrialNumber() {
        return this.trialNumber;
    }

    public void setAccountSid(String accountSid) {
        this.accountSid = accountSid;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public void setTrialNumber(String trialNumber) {
        this.trialNumber = trialNumber;
    }
}
