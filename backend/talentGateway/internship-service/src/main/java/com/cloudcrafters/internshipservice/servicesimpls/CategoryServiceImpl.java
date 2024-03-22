package com.cloudcrafters.internshipservice.servicesimpls;

import com.cloudcrafters.internshipservice.daos.CategoryDao;
import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.services.CategoryService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryDao categoryDao;

    @Override
    public List<Category> getAllCategories() {
        return categoryDao.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        Optional<Category> categoryOptional = categoryDao.findById(id);
        return categoryOptional.orElse(null);
    }

    @Override
    public Category saveCategory(Category category) {
        return categoryDao.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryDao.deleteById(id);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        // Check if the category with the given id exists
        if (categoryDao.existsById(id)) {
            // Set the id of the category to update
            category.setCategoryId(id);
            return categoryDao.save(category);
        }
        return null; // Or throw an exception indicating category not found
    }
}
