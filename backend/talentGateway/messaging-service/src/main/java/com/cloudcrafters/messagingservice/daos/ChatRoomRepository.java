package com.cloudcrafters.messagingservice.daos;

import com.cloudcrafters.messagingservice.entities.*;
import org.springframework.data.mongodb.repository.*;
import com.cloudcrafters.messagingservice.entities.ChatRoom;

import java.util.*;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);
}
