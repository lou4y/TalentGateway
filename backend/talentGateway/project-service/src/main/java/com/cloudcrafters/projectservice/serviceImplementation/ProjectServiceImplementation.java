package com.cloudcrafters.projectservice.serviceImplementation;

import com.cloudcrafters.projectservice.daos.ProjectDao;
import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.enums.ProjectStatus;
import com.cloudcrafters.projectservice.services.ProjectService;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectServiceImplementation implements ProjectService {
    @Autowired
    private ProjectDao projectDao;
    private Cloudinary cloudinary;
    @Override
    public List<Project> getAllProjects() {
        return projectDao.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        if(id!=null){
            final Optional<Project> optionalProject=projectDao.findById(id);
            if(optionalProject.isPresent()){
                return optionalProject.get();
            }
        }

        return null;
    }

    @Override
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        Map<String, Object> result = cloudinary.uploader().upload(
                multipartFile.getBytes(),
                Map.of("public_id", UUID.randomUUID().toString())
        );

        return (String) result.get("url");
    }
    @Override
    public Project addProject(Project p) {
        return projectDao.save(p);
    }

    @Override
    public Project updateProject(Project p) {
        return projectDao.save(p);
    }

    @Override
    public void deleteProject(Project p) {
        projectDao.delete(p);

    }
    @Override
    public List<Project> searchProjects(String searchCriteria) {
        // Implement your search logic here
        return projectDao.searchProjects(searchCriteria);
    }

}
