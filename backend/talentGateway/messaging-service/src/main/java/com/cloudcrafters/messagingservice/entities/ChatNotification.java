package com.cloudcrafters.messagingservice.entities;

import lombok.*;

import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification {

    @Id
    private String id;
    private String senderId;
    private String recipientId;
    private String content;
}
