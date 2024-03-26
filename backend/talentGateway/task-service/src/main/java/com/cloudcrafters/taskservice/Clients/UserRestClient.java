package com.cloudcrafters.taskservice.Clients;

import com.cloudcrafters.taskservice.models.User;
import org.springframework.web.bind.annotation.GetMapping;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface UserRestClient {
    @GetMapping("/users/{id}")
    //handler d'exception /fallbackMethod: la méthode qui va appler en local si l'autre échoue
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultCreator")
    User findCreatorById(@PathVariable String id);

    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultAllCreators")
    @GetMapping("/users ")
    List<User> allCreators();

    default User getDefaultCreator(String id, Exception exception){
        User user=new User();
        user.setUserId(id);
        user.setFirstName("Not available");
        user.setLastName("Not available");
        return user;
    }
    default List<User> getDefaultAllCreators(Exception exception){
        return List.of();
    }
}
