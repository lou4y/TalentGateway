package com.cloudcrafters.projectservice;

import com.cloudcrafters.projectservice.daos.ProjectDao;
import com.cloudcrafters.projectservice.entities.Project;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class ProjectServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectServiceApplication.class, args);
    }
    //ajouter projets à l'exécution de l'appli
    /*@Bean
    CommandLineRunner commandLineRunner(ProjectDao projectDao){
        return args -> {
            // Create a Calendar instance and set it to the desired date
            Calendar calendar = Calendar.getInstance();
            calendar.set(2024, Calendar.MARCH, 20);

            // Get a java.util.Date object from the Calendar instance
            Date startDate = calendar.getTime();

            // Create a list of projects to save
            List<Project> projectList = Arrays.asList(
                    Project.builder()
                            .projectName("first project")
                            .projectDescription("first project description")
                            .price(100)
                            .projectStatus(Project.ProjectStatus.IN_PROGRESS)
                            .startDate(startDate)
                            .build(),
                    Project.builder()
                            .projectName("second project")
                            .projectDescription("second project description")
                            .price(100)
                            .projectStatus(Project.ProjectStatus.COMPLETED)
                            .build()
            );

            // Save all projects to the database
            projectDao.saveAll(projectList);
        };
    }*/
}
