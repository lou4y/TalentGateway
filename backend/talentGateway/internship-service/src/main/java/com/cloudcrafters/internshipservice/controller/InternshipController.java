package com.cloudcrafters.internshipservice.controller;


import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.services.CategoryService;
import com.cloudcrafters.internshipservice.services.InternshipService;
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


}
