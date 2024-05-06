package com.cloudcrafters.internshipservice.daos;

import com.cloudcrafters.internshipservice.entites.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryDao extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryName(String categoryName);
    List<Category> findCategoryByUserId(String userId) ;

}

