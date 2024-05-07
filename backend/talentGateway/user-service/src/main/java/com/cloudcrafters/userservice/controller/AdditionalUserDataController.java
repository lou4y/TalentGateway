package com.cloudcrafters.userservice.controller;

import com.cloudcrafters.userservice.entity.AdditionalUserData;
import com.cloudcrafters.userservice.services.AdditionalUserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile/additionalUserData")
public class AdditionalUserDataController {
    @Autowired
    private AdditionalUserDataService additionalUserDataService;
    @PostMapping(value = "Add")
    public AdditionalUserData addAdditionalUserData(@RequestBody AdditionalUserData additionalUserData) {
        return this.additionalUserDataService.addAdditionalUserData(additionalUserData);
    }
    @PutMapping(value = "Edit")
    public AdditionalUserData updateAdditionalUserData(@RequestBody AdditionalUserData additionalUserData) {
        return this.additionalUserDataService.updateAdditionalUserData(additionalUserData);
    }
    @DeleteMapping(value = "Delete/{userId}")
    public void deleteAdditionalUserData(@PathVariable String userId) {
        this.additionalUserDataService.deleteAdditionalUserData(userId);
    }
    @GetMapping(value = "Get/{userId}")
    public AdditionalUserData getAdditionalUserData(@PathVariable String userId) {
        return this.additionalUserDataService.getAdditionalUserData(userId);
    }
    @GetMapping(value = "GetAll")
    public Iterable<AdditionalUserData> getAllAdditionalUserData() {
        return this.additionalUserDataService.getAllAdditionalUserData();
    }

}
