package com.cloudcrafters.internshipservice.controller;


import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.services.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin("*")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private LinkedInService linkedInService;

    @Autowired
    private ScheduledTasks scheduledTasks;

    //create internship

    @PostMapping
    @ResponseBody
    public ResponseEntity<Object> createInternship(@RequestBody Internship internship) {
        try {
            // Check if categories are provided in the request
            if (internship.getCategories() != null && !internship.getCategories().isEmpty()) {
                Set<Category> categories = new HashSet<>();
                for (Category category : internship.getCategories()) {
                    // Check if the category already exists in the database
                    Category existingCategory = categoryService.getCategoryByName(category.getCategoryName());
                    if (existingCategory != null) {
                        // If the category exists, use the existing one
                        categories.add(existingCategory);
                    } else {
                        // If the category doesn't exist, save the new category
                        Category savedCategory = categoryService.saveCategory(category);
                        categories.add(savedCategory);
                    }
                }
                // Set the categories for the internship
                internship.setCategories(categories);
            } else {
                // If no categories are provided, set the internship to the "other" category
                Category otherCategory = categoryService.getCategoryByName("other");
                if (otherCategory == null) {
                    // If "other" category doesn't exist, create it
                    otherCategory = Category.builder().categoryName("other").categoryDescription("Other").build();
                    otherCategory = categoryService.saveCategory(otherCategory);
                }
                // Set the "other" category for the internship
                internship.setCategories(Collections.singleton(otherCategory));
            }
            // Save the internship
            Internship savedInternship = internshipService.saveInternship(internship);
            return ResponseEntity.ok(savedInternship);
        } catch (Exception e) {
            e.printStackTrace(); // Print the stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }




    //get all internships
    @GetMapping
    @ResponseBody
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }


    //get internship by id
    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        Internship internship = internshipService.getInternshipById(id);
        if (internship != null) {
            return ResponseEntity.ok(internship);
        } else {
            return ResponseEntity.notFound().build();
        }

    }

    //delete internship by id
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<String> deleteInternshipById(@PathVariable Long id) {
        try {
            internshipService.deleteInternshipById(id);
            return ResponseEntity.ok("Internship deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //update internship by id
    @PutMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship internship) {
        Internship updatedInternship = internshipService.updateInternship(id, internship);
        if (updatedInternship != null) {
            return ResponseEntity.ok(updatedInternship);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    @ResponseBody
    public List<Internship> searchInternshipsByKeyword(@RequestParam String keyword) {
        return internshipService.searchInternshipsByKeyword(keyword);
    }

    @GetMapping("/tree-by-posted-date")
    @ResponseBody
    public List<Internship> treeInternshipsByPostedDate() {
        return internshipService.treeInternshipsByPostedDate();
    }



    @GetMapping("/user/{userId}")
    public List<Internship> getInternshipsByUserId(@PathVariable String userId) {
        return internshipService.getInternshipbyuser(userId);
    }





    @PostMapping("/{id}/rating")
    public ResponseEntity<String> rateInternshipByUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestBody
    ) {
        try {
            int rating = (int) requestBody.get("rating");
            String userId = (String) requestBody.get("userId");

            // Call the service method to update the rating
            internshipService.rateInternshipByUser(id, rating, userId);

            return ResponseEntity.ok("Internship rating updated successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body("Internship not found with id: " + id);
        }
    }

    // Get statistics for the number of internships
    @GetMapping("/statistics/total")
    public ResponseEntity<Long> getTotalInternshipsCount() {
        long totalInternships = internshipService.getTotalInternshipsCount();
        return ResponseEntity.ok(totalInternships);
    }

    @GetMapping("/statistics/average-rating")
    public ResponseEntity<Double> getAverageRatingOfInternships() {
        double averageRating = internshipService.getAverageRatingOfInternships();
        return ResponseEntity.ok(averageRating);
    }


    @GetMapping("/statistics/total-by-user/{userId}")
    public ResponseEntity<Long> getTotalInternshipsCountByUser(@PathVariable String userId) {
        long totalInternships = internshipService.getTotalInternshipsCountByUser(userId);
        return ResponseEntity.ok(totalInternships);
    }

    @GetMapping("/internshipsstatistics/total")
    public ResponseEntity<Long> getTotalInternshipsr() {
        long totalInternships = internshipService.getTotalInternshipsCount();
        return ResponseEntity.ok(totalInternships);
    }



    @PostMapping("/share-internship")
    public void shareInternshipOnLinkedIn(
            @RequestParam String internshipTitle,
            @RequestParam String internshipDescription

    ) {
        linkedInService.shareInternship(internshipTitle, internshipDescription);
    }


    @GetMapping("/grouped-by-category")
    public ResponseEntity<Map<Category, List<Internship>>> getInternshipsGroupedByCategory() {
        Map<Category, List<Internship>> internshipsGroupedByCategory = internshipService.getInternshipsGroupedByCategory();

        if (internshipsGroupedByCategory.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(internshipsGroupedByCategory, HttpStatus.OK);
    }


    @GetMapping("/emails-sent-per-internship")
    public ResponseEntity<Map<Long, Integer>> getEmailsSentPerInternship() {
        Map<Long, Integer> emailsSentPerInternship = scheduledTasks.getEmailsSentPerInternship();
        return ResponseEntity.ok(emailsSentPerInternship);
    }

}