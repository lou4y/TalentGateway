package com.cloudcrafters.messagingservice.controllers;


import lombok.*;
import org.springframework.http.*;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
 import com.cloudcrafters.messagingservice.services.*;
import java.util.*;
import com.cloudcrafters.messagingservice.controllers.*;
import com.cloudcrafters.messagingservice.entities.*;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public User addUser(
            @Payload User user
    ) {
        userService.saveUser(user);
        return user;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public User disconnectUser(
            @Payload User user
    ) {
        userService.disconnect(user);
        return user;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findConnectedUsers() {
        return ResponseEntity.ok(userService.findConnectedUsers());
    }
}
