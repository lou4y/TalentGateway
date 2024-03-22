package com.cloudcrafters.internshipservice.daos;

import com.cloudcrafters.internshipservice.entites.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryDao extends JpaRepository<Category, Long> {
}
