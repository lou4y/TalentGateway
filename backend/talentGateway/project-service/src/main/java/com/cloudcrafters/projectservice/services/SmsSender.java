package com.cloudcrafters.projectservice.services;

import com.cloudcrafters.projectservice.entities.SmsRequest;

public interface SmsSender {
    void sendSms(SmsRequest smsRequest);
}
