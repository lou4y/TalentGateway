package com.cloudcrafters.taskservice.Clients;

import com.cloudcrafters.taskservice.models.Project;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@ForgeinClient(name = "project-service", url = "http://localhost:8080/PROJECT-SERVICE")
public interface ProjectRestClient {
    @CircuitBreaker(name = "internship-servic", fallbackMethod = "getDefaultCreator")
    @GetMapping("projects/{id}")
    Project getProjectById(@PathVariable("id") String offreId);


    default Project getDefaultCreator(String id, Exception exception) {
        Project offre = new Project();

        Project.setPrject("Not available");
        Project.setIntershipTitle("Not available");
        return offre;
    }
}
