package com.cloudcrafters.internshipservice.servicesimpls;


import com.cloudcrafters.internshipservice.daos.CategoryDao;
import com.cloudcrafters.internshipservice.daos.InternshipDao;
import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.entites.Rating;
import com.cloudcrafters.internshipservice.services.InternshipService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


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
    public List<Internship> getInternshipbyuser(String userId) {
        //list of internship for his user
        return InternshipDao.findByUserId(userId);
    }



    @Override
    public void rateInternshipByUser(Long internshipId, int rating, String userId) throws EntityNotFoundException {
        Optional<Internship> optionalInternship = InternshipDao.findById(internshipId);
        if (optionalInternship.isPresent()) {
            Internship internship = optionalInternship.get();
            Set<Rating> ratings = internship.getRatings();

            // Check if the user has already rated the internship
            Optional<Rating> existingRating = ratings.stream()
                    .filter(r -> r.getUserId().equals(userId))
                    .findFirst();

            if (existingRating.isPresent()) {
                // Update the existing rating
                Rating ratingToUpdate = existingRating.get();
                ratingToUpdate.setRating(rating);
            } else {
                // Create a new rating
                Rating newRating = new Rating();
                newRating.setRating(rating);
                newRating.setUserId(userId);
                newRating.setInternship(internship);
                ratings.add(newRating);
            }

            // Calculate the average rating
            double totalRating = ratings.stream().mapToDouble(Rating::getRating).sum();
            double averageRating = totalRating / ratings.size();
            internship.setAverageRating(averageRating);

            // Save the updated internship
            InternshipDao.save(internship);
        } else {
            throw new EntityNotFoundException("Internship not found with id: " + internshipId);
        }
    }


    @Override
    public long getTotalInternshipsCount() {
        return InternshipDao.count(); // Assuming InternshipDao has a count method
    }

    @Override
    public double getAverageRatingOfInternships() {
        List<Internship> internships = InternshipDao.findAll();
        double totalRating = 0;
        int totalInternships = 0;
        for (Internship internship : internships) {
            if (internship.getAverageRating() != null) {
                totalRating += internship.getAverageRating();
                totalInternships++;
            }
        }
        return totalInternships > 0 ? totalRating / totalInternships : 0;
    }

    @Override
    public long getTotalInternshipsCountByUser(String userId) {
        return InternshipDao.countByUserId(userId); // Assuming InternshipDao has a countByUserId method
    }

    @Override
    public long getTotalInternshipsr() {
        return InternshipDao.count();
    }


    @Override
    public Map<Category, List<Internship>> getInternshipsGroupedByCategory() {
        List<Internship> internships = InternshipDao.findAll(); // Fetch all internships

        // Group internships by category using Java streams and Collectors.groupingBy
        return internships.stream()
                .flatMap(internship -> internship.getCategories().stream().map(category -> Map.entry(category, internship)))
                .collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.mapping(Map.Entry::getValue, Collectors.toList())));
    }



}