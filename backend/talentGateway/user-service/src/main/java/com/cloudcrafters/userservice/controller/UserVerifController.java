package com.cloudcrafters.userservice.controller;

import com.cloudcrafters.userservice.entity.UserVerif;
import com.cloudcrafters.userservice.services.UserVerifService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile/userVerif")
public class UserVerifController {
    @Autowired
    private UserVerifService userVerifService;
    @PostMapping(value = "Add")
    public UserVerif addUserVerif(@RequestBody UserVerif userVerif) {
        return this.userVerifService.addUserVerif(userVerif);
    }
    @PutMapping(value = "Edit")
    public UserVerif updateUserVerif(@RequestBody UserVerif userVerif) {
        return this.userVerifService.updateUserVerif(userVerif);
    }
    @DeleteMapping(value = "Delete/{userID}")
    public void deleteUserVerif(@PathVariable String userID) {
        this.userVerifService.deleteUserVerif(userID);
    }
    @GetMapping(value = "Get/{UserID}")
    public UserVerif getUserVerif(@PathVariable String UserID) {
        return this.userVerifService.getUserVerif(UserID);
    }

}
