package com.cloudcrafters.internshipservice.controller;

import com.cloudcrafters.internshipservice.services.LinkedInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/linkedin")
@CrossOrigin("*")
public class LinkedInController {

    private final LinkedInService linkedInService;

    @Autowired
    public LinkedInController(LinkedInService linkedInService) {
        this.linkedInService = linkedInService;
    }

    @PostMapping("/share")
    public ResponseEntity<String> shareInternshipOnLinkedIn(@RequestParam Long internshipId) {
        try {
            linkedInService.shareInternshipOnLinkedIn(internshipId);
            return ResponseEntity.ok("Internship shared on LinkedIn successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sharing internship on LinkedIn: " + e.getMessage());
        }
    }
}