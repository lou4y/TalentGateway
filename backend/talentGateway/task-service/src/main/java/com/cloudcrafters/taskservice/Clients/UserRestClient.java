package com.cloudcrafters.taskservice.Clients;

import com.cloudcrafters.taskservice.models.User;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@FeignClient(name="USER-SERVICE")
public interface UserRestClient {

    @GetMapping("/keycloak/users/{id}")
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultUser")
    User findUserById(@PathVariable String id);

    @GetMapping("/keycloak/users")
    List<User> getAllUsers();
    // Methods for User entity

    default User getDefaultUser(String id, Exception exception) {
        User user = new User();
        user.setId(id);
        // Set default values
        user.setFirstName("Not available");
        user.setLastName("Not available");
        return user;
    }

    default List<User> getDefaultAllUsers(Exception exception) {
        return List.of();
    }

}
