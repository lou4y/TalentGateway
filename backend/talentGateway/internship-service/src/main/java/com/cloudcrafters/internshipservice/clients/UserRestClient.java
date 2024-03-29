package com.cloudcrafters.internshipservice.clients;

import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.models.User;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "SERVICE-USERTEST")
public interface UserRestClient {

    @GetMapping("/users/{id}")
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultUser")
    User findUserById(@PathVariable String id);

    @GetMapping("/users")
    List<User> getAllUsers();



    default User getDefaultUser(String id, Exception exception) {
        User user = new User();
        user.setUserId(id);
        // Set default values
        user.setFirstName("Not available");
        user.setLastName("Not available");
        return user;
    }

    default List<User> getDefaultAllUsers(Exception exception) {
        return List.of();
    }
}
