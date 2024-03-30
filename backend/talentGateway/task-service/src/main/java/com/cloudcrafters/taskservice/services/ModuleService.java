package com.cloudcrafters.taskservice.services;

import com.cloudcrafters.taskservice.Entities.Module;
import java.util.List;
import java.util.Optional;

public interface ModuleService {
    Module createModule(Module module);
    Module updateModule(Long moduleId, Module moduleDetails);
    List<Module> getAllModules();
    Module getModuleById(Long moduleId);
    void deleteModule(Long moduleId);

    Optional<Module> getModuleByName(String moduleName);
}
