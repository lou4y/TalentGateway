package com.cloudcrafters.messagingservice.daos;

import com.cloudcrafters.messagingservice.entities.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);

    List<ChatRoom> findBySenderIdOrRecipientId(String senderId, String recipientId);
}
