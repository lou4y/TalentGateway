package com.cloudcrafters.internshipservice.servicesimpls;

import com.cloudcrafters.internshipservice.daos.InternshipDao;
import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.services.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class InternshipServiceImpl  implements InternshipService {
    @Autowired
    private InternshipDao internshipDao;

    @Override
    public Internship createInternship(Internship internship) {
        return internshipDao.save(internship);
    }

    @Override
    public Internship updateInternship(Internship internship) {
        return internshipDao.save(internship);
    }

    @Override
    public Internship getInternshipById(Long id) {
        Optional<Internship> internshipOptional = internshipDao.findById(id);
        return internshipOptional.orElse(null);
    }

    @Override
    public void deleteInternshipById(Long id) {
        internshipDao.deleteById(id);
    }

    @Override
    public List<Internship> getAllInternships() {
        return internshipDao.findAll();
    }

    @Override
    public List<Internship> getAllInternshipsByCategory(Long categoryId) {
        // Implement this method based on your requirements
        return internshipDao.findAllByCategoryId(categoryId);

    }

    @Override
    public List<Internship> getAllInternshipsByUserId(String userId) {
        // Implement this method based on your requirements
        return internshipDao.findInternshipsByUserId(userId);

    }

    @Override
    public Internship addInternshipToCategory(Long internshipId, Long categoryId) {
        Optional<Internship> internshipOptional = internshipDao.findById(internshipId);
        if (internshipOptional.isPresent()) {
            Internship internship = internshipOptional.get();
            // Set the category for the internship
            internship.setCategory(new Category(categoryId, "", ""));
            return internshipDao.save(internship);
        }
        return null; // or throw exception indicating internship not found
    }

    @Override
    public Internship removeInternshipFromCategory(Long internshipId, Long categoryId) {
        Optional<Internship> internshipOptional = internshipDao.findById(internshipId);
        if (internshipOptional.isPresent()) {
            Internship internship = internshipOptional.get();
            // Remove the category for the internship
            internship.setCategory(null);
            return internshipDao.save(internship);
        }
        return null; // or throw exception indicating internship not found
    }



    // Other methods implementation remains the same as before
}
