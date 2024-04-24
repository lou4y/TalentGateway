package com.cloudcrafters.messagingservice.controllers;

import com.cloudcrafters.messagingservice.entities.*;
import com.cloudcrafters.messagingservice.services.*;
import lombok.*;
import org.springframework.http.*;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages",
                new ChatNotification(
                        savedMsg.getId(),
                        savedMsg.getSenderId(),
                        savedMsg.getRecipientId(),
                        savedMsg.getContent()
                )
        );
    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable String senderId,
                                                              @PathVariable String recipientId) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

    @DeleteMapping("/delete-message/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable String messageId) {
        chatMessageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }
}
