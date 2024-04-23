package com.cloudcrafters.messagingservice.services;

import com.cloudcrafters.messagingservice.entities.*;
import com.cloudcrafters.messagingservice.services.*;
import com.cloudcrafters.messagingservice.daos.*;
import lombok.*;
import org.springframework.stereotype.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow(); // You can create your own dedicated exception

        // Encrypt the content before saving
        chatMessage.setContent(ChatMessage.encrypt(chatMessage.getContent()));

        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        List<ChatMessage> messages = chatId.map(repository::findByChatId).orElse(new ArrayList<>());

        // Decrypt the content of each message
        messages.forEach(message -> message.setContent(ChatMessage.decrypt(message.getContent())));

        return messages;
    }

    public void deleteMessage(String messageId) {
        repository.deleteById(messageId);
    }
}
