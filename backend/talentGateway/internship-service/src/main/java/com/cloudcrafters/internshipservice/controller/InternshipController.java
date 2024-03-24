package com.cloudcrafters.internshipservice.controller;


import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.services.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class InternshipController {
    @Autowired
    private InternshipService internshipService;

    @PostMapping
    public Internship createInternship(@RequestBody Internship internship) {
        return internshipService.createInternship(internship);
    }

    @PutMapping("/{id}")
    public Internship updateInternship(@PathVariable Long id, @RequestBody Internship internship) {
        internship.setIntershipId(id);
        return internshipService.updateInternship(internship);
    }

    @GetMapping("/{id}")
    public Internship getInternshipById(@PathVariable Long id) {
        return internshipService.getInternshipById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteInternshipById(@PathVariable Long id) {
        internshipService.deleteInternshipById(id);
    }

    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }


    @GetMapping("/categories/{categoryId}")
    public List<Internship> getAllInternshipsByCategory(@PathVariable Long categoryId) {
        return internshipService.getAllInternshipsByCategory(categoryId);
    }

    @PostMapping("/categories/{categoryId}/add/{internshipId}")
    public Internship addInternshipToCategory(@PathVariable Long categoryId, @PathVariable Long internshipId) {
        return internshipService.addInternshipToCategory(internshipId, categoryId);
    }

    @DeleteMapping("/categories/{categoryId}/remove/{internshipId}")
    public Internship removeInternshipFromCategory(@PathVariable Long categoryId, @PathVariable Long internshipId) {
        return internshipService.removeInternshipFromCategory(internshipId, categoryId);
    }
}
