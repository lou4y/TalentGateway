package com.cloudcrafters.internshipservice.daos;

import com.cloudcrafters.internshipservice.entites.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InternshipDao extends JpaRepository<Internship, Long> {


    @Query("SELECT i FROM Internship i WHERE i.category.CategoryId = :categoryId")
    List<Internship> findAllByCategoryId(@Param("categoryId") Long categoryId);
    List<Internship> findInternshipsByUserId(String userId);
}
