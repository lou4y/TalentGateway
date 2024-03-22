package com.cloudcrafters.internshipservice.controller;

import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.services.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internships")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @PostMapping
    public ResponseEntity<Internship> createInternship(@RequestBody Internship internship) {
        Internship createdInternship = internshipService.createInternship(internship);
        return new ResponseEntity<>(createdInternship, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        Internship internship = internshipService.getInternshipById(id);
        if (internship != null) {
            return new ResponseEntity<>(internship, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<Internship>> getAllInternships() {
        List<Internship> internships = internshipService.getAllInternships();
        return new ResponseEntity<>(internships, HttpStatus.OK);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Internship>> getAllInternshipsByCategory(@PathVariable Long categoryId) {
        List<Internship> internships = internshipService.getAllInternshipsByCategory(categoryId);
        return new ResponseEntity<>(internships, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Internship>> getAllInternshipsByUserId(@PathVariable String userId) {
        List<Internship> internships = internshipService.getAllInternshipsByUserId(userId);
        return new ResponseEntity<>(internships, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship internshipDetails) {
        Internship existingInternship = internshipService.getInternshipById(id);
        if (existingInternship != null) {
            internshipDetails.setIntershipId(id);
            Internship updatedInternship = internshipService.updateInternship(internshipDetails);
            return new ResponseEntity<>(updatedInternship, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInternshipById(@PathVariable Long id) {
        Internship existingInternship = internshipService.getInternshipById(id);
        if (existingInternship != null) {
            internshipService.deleteInternshipById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
