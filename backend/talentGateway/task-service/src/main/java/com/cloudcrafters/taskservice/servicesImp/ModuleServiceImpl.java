package com.cloudcrafters.taskservice.servicesImp;

import com.cloudcrafters.taskservice.Clients.ProjectRestClient;
import com.cloudcrafters.taskservice.Dao.ModuleDao;
import com.cloudcrafters.taskservice.Entities.Module;
import com.cloudcrafters.taskservice.models.Project;
import com.cloudcrafters.taskservice.services.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


import com.cloudcrafters.taskservice.Clients.ProjectRestClient;
import com.cloudcrafters.taskservice.Dao.ModuleDao;
import com.cloudcrafters.taskservice.Entities.Module;
import com.cloudcrafters.taskservice.models.Project;
import com.cloudcrafters.taskservice.services.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {

    private final ModuleDao moduleDao;
    private final ProjectRestClient projectRestClient;

    @Override
    public Module createModule(Module module) {
        // Fetch the project by projectName
        Optional<Project> optionalProject = projectRestClient.findProjectByName(module.getProjectName());

        if (optionalProject.isEmpty()) {
            throw new RuntimeException("Project not found for name: " + module.getProjectName());
        }

        Project project = optionalProject.get();

        // Set projectId and project details from fetched project
        module.setProjectId(project.getProjectId());
        module.setProjectName(project.getProjectName());
        module.setProjectDescription(project.getProjectDescription());

        return moduleDao.save(module);
    }

    @Override
    public Module updateModule(Long moduleId, Module moduleDetails) {
        Module existingModule = moduleDao.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found for id: " + moduleId));
        existingModule.setModuleName(moduleDetails.getModuleName());
        existingModule.setModuleDescription(moduleDetails.getModuleDescription());
        return moduleDao.save(existingModule);
    }

    @Override
    public List<Module> getAllModules() {
        return moduleDao.findAll();
    }

    @Override
    public Module getModuleById(Long moduleId) {
        return moduleDao.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found for This id: " + moduleId));
    }

    @Override
    public void deleteModule(Long moduleId) {
        Module module = getModuleById(moduleId);
        moduleDao.delete(module);
    }

    //test
    @Override
    public Optional<Module> getModuleByName(String moduleName) {
        return moduleDao.findByModuleName(moduleName);
    }
}
