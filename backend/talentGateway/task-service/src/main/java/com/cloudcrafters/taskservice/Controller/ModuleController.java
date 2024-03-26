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
@RequiredArgsConstructor
@RestController
@RequestMapping("/Modules") // Note the leading slash for consistency
public class ModuleController {

    @Autowired
    private final ModuleService moduleService;

    @Autowired
    private final ProjectRestClient projectRestClient;


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
        return moduleService.getAllModules();

    }

    // Get module by ID
    @GetMapping("GetModuleById/{moduleId}")
    public ResponseEntity<?> getModuleById(@PathVariable Long moduleId) {
        try {
            Module module = moduleService.getModuleById(moduleId);
            return ResponseEntity.ok(module);
        } catch (RuntimeException ex) {
            // Assuming the exception is thrown if the module is not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Module not found with ID: " + moduleId);
        }
    }

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
