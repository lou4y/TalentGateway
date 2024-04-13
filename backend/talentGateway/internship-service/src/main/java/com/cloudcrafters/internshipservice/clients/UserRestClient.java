package com.cloudcrafters.internshipservice.clients;

import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.enums.SkillLevel;
import com.cloudcrafters.internshipservice.models.Skill;
import com.cloudcrafters.internshipservice.models.User;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserRestClient {

    @GetMapping("/keycloak/users/{id}")
    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultUser")
    User findUserById(@PathVariable String id);

    @GetMapping("/keycloak/users/")
    List<User> getAllUsers();
    // Methods for User entity

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


    // Methods for Skill entity
    @GetMapping("/profile/skill/{id}")
    Skill findSkillById(@PathVariable Long id);

    @GetMapping("/profile/skills/{userId}")
    List<Skill> findSkillsByUserId(@PathVariable String userId);


    // Default method for handling fallback for skill operations
    default Skill getDefaultSkill(Long id, Exception exception) {
        Skill skill = new Skill();
        skill.setId(id);
        skill.setSkillName("Not available");
        skill.setSkillLevel(SkillLevel.BEGINNER); // Set default skill level
        return skill;
    }
}
