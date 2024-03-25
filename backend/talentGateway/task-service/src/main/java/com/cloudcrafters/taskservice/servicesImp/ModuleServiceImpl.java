package com.cloudcrafters.taskservice.servicesImp;

import com.cloudcrafters.taskservice.Dao.ModuleDao;
import com.cloudcrafters.taskservice.Entities.Module;
import com.cloudcrafters.taskservice.services.ModuleService;
import com.cloudcrafters.taskservice.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private final ModuleDao moduleDao;

    @Override
    public Module createModule(Module module) {
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
}
