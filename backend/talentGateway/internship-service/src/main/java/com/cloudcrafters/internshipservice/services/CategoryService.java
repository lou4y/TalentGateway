package com.cloudcrafters.internshipservice.services;

import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    Category saveCategory(Category category);
    List<Category> getAllCategories();
    //get category by id
    Category getCategoryById(Long id);
    Category updateCategory(Long id, Category category);
    Category getCategoryByName(String categoryName);
    void deleteCategoryById(Long id);


    List<Category> getCategorybyuser(String userId);



}
