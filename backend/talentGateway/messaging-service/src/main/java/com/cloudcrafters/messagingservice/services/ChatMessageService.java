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
        // Get or create the chat room ID
        String chatId = chatRoomService.getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow(() -> new RuntimeException("Failed to get or create chat room ID"));

        // Encrypt the content before saving
        chatMessage.setContent(ChatMessage.encrypt(chatMessage.getContent()));

        chatMessage.setChatId(chatId);
        return repository.save(chatMessage);
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        // Get the chat room ID
        String chatId = chatRoomService.getChatRoomId(senderId, recipientId, false)
                .orElseThrow(() -> new RuntimeException("Chat room ID not found"));

        // Find messages by chat ID
        List<ChatMessage> messages = repository.findByChatId(chatId);

        // Decrypt the content of each message
        messages.forEach(message -> message.setContent(ChatMessage.decrypt(message.getContent())));

        return messages;
    }

    public void deleteMessage(String messageId) {
        repository.deleteById(messageId);
    }

    // Method to find user chats where the user is either a sender or a recipient
    public List<ChatMessage> findUserChats(String userId) {
        // Retrieve chats where the user is either a sender or a recipient
        return repository.findBySenderIdOrRecipientId(userId, userId);
    }

    public List<ChatMessage> findChatMessagesByChatId(String chatId) {
        return repository.findByChatId(chatId);
    }
}
