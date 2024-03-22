package com.cloudcrafters.internshipservice.services;

import com.cloudcrafters.internshipservice.entites.Internship;

import java.util.List;

public interface InternshipService {

    //add internship to category

    Internship createInternship(Internship internship);
    Internship updateInternship(Internship internship);
    Internship getInternshipById(Long id);
    void deleteInternshipById(Long id);
    List<Internship> getAllInternships();
    List<Internship> getAllInternshipsByCategory(Long categoryId);

    //get all internships by user id
    List<Internship> getAllInternshipsByUserId(String userId);
    //add internship to category
    Internship addInternshipToCategory(Long internshipId, Long categoryId);
    //remove internship from category
    Internship removeInternshipFromCategory(Long internshipId, Long categoryId);
    //get all internships by category id





}
