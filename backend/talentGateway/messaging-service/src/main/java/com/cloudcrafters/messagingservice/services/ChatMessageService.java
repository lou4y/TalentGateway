package com.cloudcrafters.messagingservice.services;

import com.cloudcrafters.messagingservice.entities.ChatMessage;
import com.cloudcrafters.messagingservice.daos.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        String chatId = chatRoomService.getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow(() -> new RuntimeException("Failed to get or create chat room ID"));
        chatMessage.setContent(ChatMessage.encrypt(chatMessage.getContent()));
        chatMessage.setChatId(chatId);
        return repository.save(chatMessage);
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        String chatId = chatRoomService.getChatRoomId(senderId, recipientId, false)
                .orElseThrow(() -> new RuntimeException("Chat room ID not found"));
        List<ChatMessage> messages = repository.findByChatId(chatId);
        messages.forEach(message -> message.setContent(ChatMessage.decrypt(message.getContent())));

        return messages;
    }

    public void deleteMessage(String messageId) {
        repository.deleteById(messageId);
    }

    public List<ChatMessage> findUserChats(String userId) {
        return repository.findBySenderIdOrRecipientId(userId, userId);
    }

    public List<ChatMessage> findChatMessagesByChatId(String chatId) {
        return repository.findByChatId(chatId);
    }
}
