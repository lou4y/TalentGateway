package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.clients.UserRestClient;
import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.entities.Team;
import com.cloudcrafters.projectservice.entities.UserRoleInTeam;
import com.cloudcrafters.projectservice.enums.ProjectStatus;
import com.cloudcrafters.projectservice.models.User;
import com.cloudcrafters.projectservice.services.ProjectService;
import jakarta.ws.rs.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
//@RequestMapping("/project-service")
public class ProjectController {
    @Autowired
    ProjectService projectService;
    @Autowired
    UserRestClient userRestClient;

    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        for (Project project : projects) {
            User creator = userRestClient.findCreatorById(project.getCreatorId());
            project.setProjectCreator(creator);

            // Fetch users with roles for the project's team
            Team team = project.getTeam();
            if (team != null && team.getUsersWithRoles() != null) {
                for (UserRoleInTeam userWithRole : team.getUsersWithRoles()) {
                    User user = userRestClient.findCreatorById(userWithRole.getUserId());
                    userWithRole.setUser(user);
                }
            }
        }
        return projects;
    }

    @GetMapping("/projects/{id}")
    public Project getProjectById(@PathVariable Long id){
       Project project= projectService.getProjectById(id);
       User creator=userRestClient.findCreatorById(project.getCreatorId());
       project.setProjectCreator(creator);
       return project;
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
    @GetMapping("/projects/search")
    public List<Project> searchProjects(@RequestParam(required = false) String searchCriteria) {
        List<Project> projects = projectService.searchProjects(searchCriteria);
        for (Project project : projects) {
            User creator = userRestClient.findCreatorById(project.getCreatorId());
            project.setProjectCreator(creator);

            // Fetch users with roles for the project's team
            Team team = project.getTeam();
            if (team != null && team.getUsersWithRoles() != null) {
                for (UserRoleInTeam userWithRole : team.getUsersWithRoles()) {
                    User user = userRestClient.findCreatorById(userWithRole.getUserId());
                    userWithRole.setUser(user);
                }
            }
        }
        return projects;
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
