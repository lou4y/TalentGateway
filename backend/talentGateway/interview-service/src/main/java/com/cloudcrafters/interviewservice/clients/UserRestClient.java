package com.cloudcrafters.interviewservice.clients;

import com.cloudcrafters.interviewservice.entities.Offre;
import com.cloudcrafters.interviewservice.entities.User;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;


@FeignClient(name = "USER-SERVICE", url = "http://localhost:8888/USER-SERVICE")
public interface UserRestClient {

    @GetMapping("/keycloak/users/{id}")
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultUser")
    User findUserById(@PathVariable String id);
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultCreator")
    @GetMapping("/keycloak/users/")
    List<User> getAllUsers();
    // Methods for User entity


    default User getDefaultCreator(String id, Exception exception) {
        User user = new User();


        user.setLastName("Not available");
        user.setFirstName("Not available");
        return user;
    }


}

