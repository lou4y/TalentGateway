package com.cloudcrafters.internshipservice.servicesimpls;


import com.cloudcrafters.internshipservice.daos.CategoryDao;
import com.cloudcrafters.internshipservice.daos.InternshipDao;
import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.services.InternshipService;

import com.cloudcrafters.internshipservice.services.LinkedInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class InternshipServiceImpl implements InternshipService {

    private  LinkedInService linkedInService;

    @Autowired
    public void ShareInternshipService(LinkedInService linkedInService) {
        this.linkedInService = linkedInService;
    }


    @Autowired
    private InternshipDao InternshipDao;

    @Autowired
    private CategoryDao categoryDao;

    @Override
    public Internship saveInternship(Internship internship) {
        return InternshipDao.save(internship);
    }

    @Override
    public List<Internship> getAllInternships() {
        return InternshipDao.findAll();
    }

    @Override
    public Internship getInternshipById(Long id) {
        return InternshipDao.findById(id).orElse(null);
    }

    @Override
    public void updateInternshipCategory(Long internshipId, Long categoryId) {
        Optional<Internship> optionalInternship = InternshipDao.findById(internshipId);
        Optional<Category> optionalCategory = categoryDao.findById(categoryId);
        if (optionalInternship.isPresent() && optionalCategory.isPresent()) {
            Internship internship = optionalInternship.get();
            Category newCategory = optionalCategory.get();
            // Update the category of the internship
            Set<Category> categories = new HashSet<>();
            categories.add(newCategory);
            internship.setCategories(categories);
            // Save the updated internship
            InternshipDao.save(internship);
        }
    }

    @Override
    public Internship updateInternship(Long id, Internship internship) {
        Optional<Internship> optionalInternship = InternshipDao.findById(id);
        if (optionalInternship.isPresent()) {
            Internship existingInternship = optionalInternship.get();
            existingInternship.setIntershipTitle(internship.getIntershipTitle());
            existingInternship.setIntershipCompany(internship.getIntershipCompany());
            existingInternship.setIntershipDescription(internship.getIntershipDescription());
            existingInternship.setIntershipResponsibilities(internship.getIntershipResponsibilities());
            existingInternship.setIntershipQualifications(internship.getIntershipQualifications());
            existingInternship.setIntershipSkills(internship.getIntershipSkills());
            existingInternship.setIntershipLocation(internship.getIntershipLocation());
            existingInternship.setIntershipDuration(internship.getIntershipDuration());
            existingInternship.setIntershippostedDate(internship.getIntershippostedDate());
            existingInternship.setIntershipStartDate(internship.getIntershipStartDate());
            existingInternship.setIntershipType(internship.getIntershipType());
            existingInternship.setCategories(internship.getCategories()); // Update categories if needed
            existingInternship.setUserId(internship.getUserId());
            return InternshipDao.save(existingInternship);
        } else {
            return null; // Handle the case where internship with given id doesn't exist
        }
    }


    //delete internship by id
    @Override
    public void deleteInternshipById(Long id) {
        // Get the internship by ID
        Optional<Internship> optionalInternship = InternshipDao.findById(id);
        if (optionalInternship.isPresent()) {
            Internship internship = optionalInternship.get();

            // Remove the internship's associations with categories
            internship.getCategories().clear();

            // Save the modified internship to update the associations
            InternshipDao.save(internship);

            // Now delete the internship
            InternshipDao.deleteById(id);
        }
    }

    @Override
    public List<Internship> searchInternshipsByKeyword(String keyword) {
        List<Internship> internships = InternshipDao.findAll();

        return internships.stream()
                .filter(internship ->
                        internship.getIntershipTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                                internship.getIntershipCompany().toLowerCase().contains(keyword.toLowerCase()) ||
                                internship.getIntershipSkills().toLowerCase().contains(keyword.toLowerCase()) ||
                                internship.getIntershipLocation().toLowerCase().contains(keyword.toLowerCase()) ||
                                internship.getIntershipType().toString().toLowerCase().contains(keyword.toLowerCase()) || // Convert to string first
                                internship.getCategories().stream().anyMatch(category -> category.getCategoryName().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toList());
    }


    @Override
    public List<Internship> treeInternshipsByPostedDate() {
        List<Internship> internships = InternshipDao.findAll();
        internships.sort(Comparator.comparing(Internship::getIntershippostedDate));
        return internships;
    }

    @Override
    public void shareInternshipOnLinkedIn(Long internshipId) {
        // Call LinkedInService method to share the internship on LinkedIn
        linkedInService.shareInternshipOnLinkedIn(internshipId);
    }

    @Override
    public List<Internship> getInternshipbyuser(String userId) {
        //list of internship for his user
        return InternshipDao.findByUserId(userId);
    }

}
