package com.cloudcrafters.messagingservice.controllers;

import com.cloudcrafters.messagingservice.entities.ChatMessage;
import com.cloudcrafters.messagingservice.entities.User;
import com.cloudcrafters.messagingservice.services.ChatMessageService;
import com.cloudcrafters.messagingservice.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import com.cloudcrafters.messagingservice.services.ChatRoomService;
import com.cloudcrafters.messagingservice.entities.ChatRoom;


import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
@Controller
public class MessagingController {

    private final UserService userService;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;




    @PostMapping("/connect")
    public ResponseEntity<Void> connect(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/disconnect")
    public ResponseEntity<Void> disconnect(@RequestBody User user) {
        userService.disconnect(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/chat-history/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String senderId,
                                                            @PathVariable String recipientId) {
        List<ChatMessage> chatHistory = chatMessageService.findChatMessages(senderId, recipientId);
        return ResponseEntity.ok(chatHistory);
    }

    //TESTED APIs

    @GetMapping("/user-chats/{userId}")
    public ResponseEntity<List<ChatRoom>> getUserChats(@PathVariable String userId) {
        List<ChatRoom> userChats = chatRoomService.findUserChats(userId);
        return ResponseEntity.ok(userChats);
    }

    @GetMapping("/connected-users")
    public ResponseEntity<List<User>> getConnectedUsers() {
        List<User> connectedUsers = userService.findConnectedUsers();
        return ResponseEntity.ok(connectedUsers);
    }


    @GetMapping("/chat-messages/{chatId}")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable String chatId) {
        List<ChatMessage> chatMessages = chatMessageService.findChatMessagesByChatId(chatId);
        // Decrypt the content of each chat message
        for (ChatMessage message : chatMessages) {
            String decryptedContent = ChatMessage.decrypt(message.getContent());
            message.setContent(decryptedContent);
        }
        return ResponseEntity.ok(chatMessages);
    }

    @PostMapping("/send-message")
    public ResponseEntity<Void> sendMessage(@RequestBody ChatMessage chatMessage) {
        // Save the chat message
        chatMessageService.save(chatMessage);

        // Broadcast the message to the recipient
        messagingTemplate.convertAndSendToUser(chatMessage.getRecipientId(), "/queue/messages", chatMessage);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create-chat")
    public ResponseEntity<String> createChat(@RequestParam String senderId, @RequestParam String recipientId) {
        String chatId = chatRoomService.getChatRoomId(senderId, recipientId, true)
                .orElseThrow(() -> new RuntimeException("Failed to create chat"));

        return ResponseEntity.ok(chatId);
    }

}
