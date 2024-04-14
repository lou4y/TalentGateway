package com.cloudcrafters.messagingservice.daos;

import com.cloudcrafters.messagingservice.entities.*;
import com.cloudcrafters.messagingservice.enums.*;
import org.springframework.data.mongodb.repository.*;

import java.util.*;

public interface UserRepository extends MongoRepository<User, String> {

    List<User> findByStatus(Status status);

}
