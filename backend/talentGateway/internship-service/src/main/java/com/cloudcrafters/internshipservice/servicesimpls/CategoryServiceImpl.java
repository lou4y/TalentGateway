package com.cloudcrafters.internshipservice.servicesimpls;

import com.cloudcrafters.internshipservice.daos.CategoryDao;
import com.cloudcrafters.internshipservice.daos.InternshipDao;
import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.services.CategoryService;
import jakarta.annotation.Resource;
import jakarta.persistence.NonUniqueResultException;
import jakarta.ws.rs.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private InternshipDao internshipDao;

    @Autowired
    private InternshipServiceImpl internshipService;

    @Override
    public Category saveCategory(Category category) {
        return categoryDao.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryDao.findAll();
    }


    @Override
    public Category getCategoryById(Long id) {
        Optional<Category> optionalCategory = categoryDao.findById(id);
        return optionalCategory.orElse(null);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        Optional<Category> optionalCategory = categoryDao.findById(id);
        if (optionalCategory.isPresent()) {
            Category existingCategory = optionalCategory.get();
            existingCategory.setCategoryName(category.getCategoryName());
            existingCategory.setCategoryDescription(category.getCategoryDescription());
            return categoryDao.save(existingCategory);
        } else {
            return null;
        }
    }

    @Override
    public void deleteCategoryById(Long id) {
        Optional<Category> optionalCategory = categoryDao.findById(id);
        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            // Remove the associations between the category and internships
            for (Internship internship : category.getInternships()) {
                internship.getCategories().remove(category);
                if (internship.getCategories().isEmpty()) {
                    // If the internship has no categories after removing the deleted one, add the "other" category
                    Category otherCategory = getCategoryByName("other");
                    if (otherCategory == null) {
                        // If "other" category doesn't exist, create it
                        otherCategory = Category.builder().categoryName("other").categoryDescription("Other").build();
                        otherCategory = saveCategory(otherCategory);
                    }
                    internship.getCategories().add(otherCategory);
                }
                internshipService.saveInternship(internship);
            }
            // Delete the category
            categoryDao.deleteById(id);
        } else {
            throw new NotFoundException("Category with id " + id + " not found.");
        }
    }


    @Override
    public Category getCategoryByName(String categoryName) {
        Optional<Category> categoryOptional = categoryDao.findByCategoryName(categoryName);
        if (categoryOptional.isPresent()) {
            return categoryOptional.get();
        } else {
            throw new NotFoundException("Category with name " + categoryName + " not found.");
        }
    }
}
