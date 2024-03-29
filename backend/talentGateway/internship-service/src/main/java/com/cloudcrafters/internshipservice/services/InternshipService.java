package com.cloudcrafters.internshipservice.services;

import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;

import java.util.List;
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

}
