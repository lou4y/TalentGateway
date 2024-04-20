package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.entities.SmsRequest;
import com.cloudcrafters.projectservice.services.TwilioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/sms")
public class TwilioController {
    private final TwilioService twilioService;
    @Autowired
    public TwilioController(TwilioService service) {
        this.twilioService = service;
    }

    @PostMapping
    public void sendSms(@Valid @RequestBody SmsRequest smsRequest) {
       twilioService.sendSms(smsRequest);
    }

}
