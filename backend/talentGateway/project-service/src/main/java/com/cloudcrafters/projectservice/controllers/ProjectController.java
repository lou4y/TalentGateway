package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.clients.UserRestClient;
import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.entities.Team;
import com.cloudcrafters.projectservice.entities.UserRoleInTeam;
import com.cloudcrafters.projectservice.enums.ProjectStatus;
import com.cloudcrafters.projectservice.models.User;
import com.cloudcrafters.projectservice.serviceImplementation.CloudinaryService;
import com.cloudcrafters.projectservice.services.ProjectService;
import com.cloudcrafters.projectservice.services.TeamService;
import jakarta.ws.rs.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "*")
//@RequestMapping("/project-service")
public class ProjectController {
    @Autowired
    ProjectService projectService;
    @Autowired
    UserRestClient userRestClient;
    @Autowired
    CloudinaryService cloudinaryService;
    @Autowired
    TeamService teamService;

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
        Team team = project.getTeam();
        if (team != null && team.getUsersWithRoles() != null) {
            for (UserRoleInTeam userWithRole : team.getUsersWithRoles()) {
                User user = userRestClient.findCreatorById(userWithRole.getUserId());
                userWithRole.setUser(user);
            }
        }
       return project;
    }
    @PostMapping("/projects")
    public ResponseEntity<Project> addNewProject(@RequestBody Project project) {
        try {
            // Handle team creation or association
            if (project.getTeam() != null) {
                Team team = project.getTeam();
                if (team.getTeamId() == null) {
                    // New team, persist it first
                    team = teamService.addTeam(team); // Save the team
                    project.setTeam(team); // Associate the persisted team with the project
                }

                // Ensure that each user in the team has a proper reference to the team
                Set<UserRoleInTeam> usersWithRoles = team.getUsersWithRoles();
                if (usersWithRoles != null) {
                    for (UserRoleInTeam userRole : usersWithRoles) {
                        userRole.setTeam(team); // Link UserRoleInTeam to the team
                    }
                }
            }

            // Save the project
            Project newProject = projectService.addProject(project);
            return ResponseEntity.ok(newProject); // Return the new project
        } catch (Exception e) {
            // Handle errors and return a proper response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
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
