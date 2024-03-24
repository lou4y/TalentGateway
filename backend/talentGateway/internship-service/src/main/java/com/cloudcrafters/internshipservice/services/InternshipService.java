package com.cloudcrafters.internshipservice.services;

import com.cloudcrafters.internshipservice.entites.Internship;

import java.util.List;

public interface InternshipService {

    Internship createInternship(Internship internship);
    Internship updateInternship(Internship internship);
    Internship getInternshipById(Long id);
    void deleteInternshipById(Long id);
    List<Internship> getAllInternships();
    List<Internship> getAllInternshipsByCategory(Long categoryId);
    List<Internship> getAllInternshipsByUserId(String userId);
    Internship addInternshipToCategory(Long internshipId, Long categoryId);
    Internship removeInternshipFromCategory(Long internshipId, Long categoryId);




}
