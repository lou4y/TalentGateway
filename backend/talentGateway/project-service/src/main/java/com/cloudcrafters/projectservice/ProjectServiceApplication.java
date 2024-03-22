package com.cloudcrafters.projectservice;

import com.cloudcrafters.projectservice.clients.UserRestClient;
import com.cloudcrafters.projectservice.daos.ProjectDao;
import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.enums.ProjectStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@SpringBootApplication
@EnableFeignClients
public class ProjectServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectServiceApplication.class, args);
    }
    //ajouter projets à l'exécution de l'appli
    @Bean
    CommandLineRunner commandLineRunner(ProjectDao projectDao, UserRestClient userRestClient){
        return args -> {
            Calendar calendar = Calendar.getInstance();
            calendar.set(2024, Calendar.MARCH, 20);

            // Get a java.util.Date object from the Calendar instance
            Date startDate = calendar.getTime();
            //pour chaque user on assigne 2 projets
            userRestClient.allCreators().forEach(c->{
                Project p1= Project.builder()
                        .projectName("last project")
                        .projectDescription("last project description")
                        .price(100)
                        .projectStatus(ProjectStatus.COMPLETED).creatorId(c.getUserId())
                        .build();
                Project p2= Project.builder()
                        .projectName("third project")
                        .projectDescription("third project description")
                        .price(100)
                        .projectStatus(ProjectStatus.COMPLETED).creatorId(c.getUserId())
                        .build();

                projectDao.save(p1);
                projectDao.save(p2);
            });

            // Create a Calendar instance and set it to the desired date


            // Create a list of projects to save
            /*List<Project> projectList = Arrays.asList(
                    Project.builder()
                            .projectName("first project")
                            .projectDescription("first project description")
                            .price(100)
                            .projectStatus(ProjectStatus.IN_PROGRESS)
                            .startDate(startDate)
                            .build(),
                    Project.builder()
                            .projectName("second project")
                            .projectDescription("second project description")
                            .price(100)
                            .projectStatus(ProjectStatus.COMPLETED)
                            .build()
            );*/

            // Save all projects to the database
            //projectDao.saveAll(projectList);
        };
    }
}
