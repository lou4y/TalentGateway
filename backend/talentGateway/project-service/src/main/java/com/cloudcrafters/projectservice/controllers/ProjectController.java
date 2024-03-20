package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.services.ProjectService;
import jakarta.ws.rs.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project-service")
public class ProjectController {
    @Autowired
    ProjectService projectService;

    @GetMapping("/projects")
    public List<Project> getAllProjects(){
        return projectService.getAllProjects();
    }
    @GetMapping("/projects/{id}")
    public Project getProjectById(@PathVariable Long id){
        return projectService.getProjectById(id);
    }
    @PostMapping("/projects")
    public Project addNewProject(@RequestBody Project p){
        return projectService.addProject(p);
    }
    @PutMapping("projects/{id}")
    public Project updateProject(@PathVariable Long id,@RequestBody Project p){
        p.setProjectId(id);
        return projectService.updateProject(p);
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Long id) {
        Project p = projectService.getProjectById(id);
        if (p != null) {
            projectService.deleteProject(p);
            return ResponseEntity.ok("Project deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }
    }

}
