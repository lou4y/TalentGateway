package com.cloudcrafters.internshipservice.servicesimpls;


import com.cloudcrafters.internshipservice.daos.CategoryDao;
import com.cloudcrafters.internshipservice.daos.InternshipDao;
import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.services.InternshipService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@Service
public class InternshipServiceImpl implements InternshipService {

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


}
