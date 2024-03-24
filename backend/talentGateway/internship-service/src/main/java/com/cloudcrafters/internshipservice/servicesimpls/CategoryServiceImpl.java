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
    public Category createCategory(Category category) {
        return categoryDao.save(category);
    }

    @Override
    public Category updateCategory(Category category) {
        return categoryDao.save(category);
    }

    @Override
    public Category getCategoryById(Long id) {
        Optional<Category> categoryOptional = categoryDao.findById(id);
        return categoryOptional.orElse(null);
    }

    @Override
    public void deleteCategoryById(Long id) {
        categoryDao.deleteById(id);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryDao.findAll();
    }
}
