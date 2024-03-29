package com.cloudcrafters.internshipservice;

import com.cloudcrafters.internshipservice.daos.CategoryDao;
import com.cloudcrafters.internshipservice.daos.InternshipDao;
import com.cloudcrafters.internshipservice.entites.Category;
import com.cloudcrafters.internshipservice.entites.Internship;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@EnableScheduling
public class InternshipServiceApplication {



    public static void main(String[] args) {
        SpringApplication.run(InternshipServiceApplication.class, args);
    }


}

