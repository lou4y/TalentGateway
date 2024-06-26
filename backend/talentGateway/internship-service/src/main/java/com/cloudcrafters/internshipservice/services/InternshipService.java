package com.cloudcrafters.internshipservice.services;

import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface InternshipService {

    Internship saveInternship (Internship internship);
    List<Internship> getAllInternships();
    Internship getInternshipById(Long id);

    //delete internship by id
    void deleteInternshipById(Long id);

    void updateInternshipCategory(Long internshipId, Long categoryId);

    //update internship by id
    Internship updateInternship(Long id, Internship internship);

    List<Internship> searchInternshipsByKeyword(String keyword);

    List<Internship> treeInternshipsByPostedDate();


    List<Internship> getInternshipbyuser(String userId);


    void rateInternshipByUser(Long internshipId, int rating, String userId) throws EntityNotFoundException, IllegalArgumentException;

    //statistics
    long getTotalInternshipsCount();
    // Calculate the average rating of internships
    double getAverageRatingOfInternships();

    // Calculate the total number of internships for a specific user
    long getTotalInternshipsCountByUser(String userId);

    long getTotalInternshipsr();

    Map<Category, List<Internship>> getInternshipsGroupedByCategory();

}