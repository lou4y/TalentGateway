package com.cloudcrafters.internshipservice.services;

import com.cloudcrafters.internshipservice.entites.Category;

import java.util.List;

public interface CategoryService {
    Category createCategory(Category category);
    Category updateCategory(Category category);
    Category getCategoryById(Long id);
    void deleteCategoryById(Long id);
    List<Category> getAllCategories();

}
