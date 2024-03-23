package com.cloudcrafters.interviewservice.clients;

import org.springframework.cloud.openfeign.FeignClient;



import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "SERVICE-USERTEST")
public interface UserRestClient {

    @GetMapping("/api/users/{userId}/name")
    String getUserName(@PathVariable("userId") String userId);

    @GetMapping("/api/users/{userId}/lastname")
    String getUserLastName(@PathVariable("userId") String userId);
}