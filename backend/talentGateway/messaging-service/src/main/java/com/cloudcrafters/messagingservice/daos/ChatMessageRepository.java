package com.cloudcrafters.messagingservice.daos;

import com.cloudcrafters.messagingservice.entities.*;
import org.springframework.data.mongodb.repository.*;


import java.util.*;


public interface ChatMessageRepository extends MongoRepository<ChatMessage, String>{

    List<ChatMessage> findByChatId(String s);
}
