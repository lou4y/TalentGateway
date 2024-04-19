package com.cloudcrafters.projectservice.services;

import com.cloudcrafters.projectservice.entities.SmsRequest;
import com.cloudcrafters.projectservice.serviceImplementation.TwilioSmsSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@org.springframework.stereotype.Service
public class TwilioService {
    private final SmsSender smsSender;

    @Autowired
    public TwilioService(@Qualifier("twilio") TwilioSmsSender smsSender) {
        this.smsSender = smsSender;
    }

    public void sendSms(SmsRequest smsRequest) {
        smsSender.sendSms(smsRequest);
    }
}
