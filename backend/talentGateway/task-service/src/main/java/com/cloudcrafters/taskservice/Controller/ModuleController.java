package com.cloudcrafters.taskservice.Controller;

import com.cloudcrafters.taskservice.Clients.ProjectRestClient;
import com.cloudcrafters.taskservice.Entities.Module;
import com.cloudcrafters.taskservice.models.Project;
import com.cloudcrafters.taskservice.services.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Modules") // Note the leading slash for consistency
@CrossOrigin("*")  // autorise les requêtes de tous les domaines
public class ModuleController {

    @Autowired
    private final ModuleService moduleService;

    @Autowired
    private ProjectRestClient projectRestClient;

    public ModuleController(ModuleService moduleService, ProjectRestClient projectRestClient) {
        this.moduleService = moduleService;
        this.projectRestClient = projectRestClient;
    }

    // Create module
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Module createModule(@RequestBody Module module) {
       return moduleService.createModule(module);
    }

    // Get all modules
    @GetMapping("/GetAllModules")
    @ResponseStatus(HttpStatus.OK)
    public List<Module> getAllModules() {
        List <Module> modules = moduleService.getAllModules();
        for (Module module : modules) {
            Project project = projectRestClient.findProjectById(module.getProjectId());
            module.setProject(project);
        }
        return modules;
    }

    // Get module by ID
    @GetMapping("GetModuleById/{moduleId}")
    public Module getModuleById(@PathVariable Long moduleId) {
        Module module = moduleService.getModuleById(moduleId);
        Project project = projectRestClient.findProjectById(module.getProjectId());
        module.setProject(project);
        return module; }


    // Update module
    @PutMapping("UpdateModule/{moduleId}")
    @ResponseStatus(HttpStatus.OK)
    public Module updateModule(@PathVariable Long moduleId, @RequestBody Module moduleDetails) {
        return moduleService.updateModule(moduleId, moduleDetails);
    }


    // Delete module
    @DeleteMapping("/DeleteModule/{moduleId}")
    public ResponseEntity<String> deleteModule(@PathVariable Long moduleId) {
        try {
            Module module = moduleService.getModuleById(moduleId);
            moduleService.deleteModule(moduleId);
            return ResponseEntity.ok("Module deleted successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Module not found for this Module_Id: "+ + moduleId);
        }
    }
}
