package com.cloudcrafters.interviewservice.clients;

import com.cloudcrafters.interviewservice.entities.User;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Collections;
import java.util.List;

@FeignClient(name = "USER-SERVICE", url = "http://localhost:8888/USER-SERVICE")
public interface UserRestClient {

    @GetMapping("/keycloak/users/{id}")
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultUser")
    User findUserById(@PathVariable String id);

    @GetMapping("/keycloak/users/")
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultCreator")
    List<User> getAllUsers();

    default User getDefaultUser(String id, Exception exception) {
        User user = new User();
        user.setFirstName("Not available");
        user.setLastName("Not available");
        return user;
    }

    default List<User> getDefaultCreator(Exception exception) {
        // Handle the fallback for getAllUsers() here
        return Collections.emptyList();
    }
}
