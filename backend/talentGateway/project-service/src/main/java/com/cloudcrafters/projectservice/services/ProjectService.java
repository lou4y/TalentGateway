package com.cloudcrafters.projectservice.services;

import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.enums.ProjectStatus;

import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();
    Project getProjectById(Long id);
    Project addProject(Project p);
    Project updateProject(Project p);
    void deleteProject(Project p);
    List<Project> searchProjects(String searchCriteria);
}
