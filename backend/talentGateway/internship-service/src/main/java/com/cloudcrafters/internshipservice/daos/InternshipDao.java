package com.cloudcrafters.internshipservice.daos;

import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InternshipDao extends JpaRepository<Internship, Long> {



    List<Internship> findByUserId(String userId);

    long countByUserId(String userId);
}
