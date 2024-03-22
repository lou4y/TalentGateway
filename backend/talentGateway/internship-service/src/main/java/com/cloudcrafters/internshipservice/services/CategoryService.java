package com.cloudcrafters.internshipservice.services;

import com.cloudcrafters.internshipservice.entites.Category;

import java.util.List;

public interface CategoryService {
     List<Category> getAllCategories();
    public Category getCategoryById(Long id);
    public Category saveCategory(Category category);
    public void deleteCategory(Long id);
    public Category updateCategory(Long id, Category category);


}
