package com.cloudcrafters.taskservice.Clients;

import com.cloudcrafters.taskservice.models.Project;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@FeignClient(name="PROJECT-SERVICE")
public interface ProjectRestClient {

    @GetMapping("/projects/{id}")
    @CircuitBreaker(name = "project-service", fallbackMethod = "getDefaultProject")
    Project findProjectById(@PathVariable Long id);

    @GetMapping("/projects")
    List<Project> findAllProjects();

    default Project getDefaultProject(Long id, Exception exception){
        Project project = new Project();
        project.setProjectId(id);
        project.setProjectName("Not available");
        project.setProjectDescription("Not available");
        project.setStartDate(null);
        project.setEndTime(null);
        project.setPrice(0);
        return project;
    }

    default Optional<Project> findProjectByName(String projectName) {
        List<Project> projects = findAllProjects();
        return projects.stream()
                .filter(p -> p.getProjectName().equalsIgnoreCase(projectName))
                .findFirst();
    }
}
