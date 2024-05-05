package com.cloudcrafters.taskservice.Controller;

import com.cloudcrafters.taskservice.Clients.ProjectRestClient;

import com.cloudcrafters.taskservice.Dao.ModuleDao;
import com.cloudcrafters.taskservice.Entities.Module;
import com.cloudcrafters.taskservice.models.Project;
import com.cloudcrafters.taskservice.services.ModuleService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.Store;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Modules")
@CrossOrigin("*")  // autorise les requêtes de tous les domaines
public class ModuleController {

    @Autowired
    private final ModuleService moduleService;

    @Autowired
    private ProjectRestClient projectRestClient;
    private ModuleDao moduleDao;

    public ModuleController(ModuleService moduleService, ProjectRestClient projectRestClient) {
        this.moduleService = moduleService;
        this.projectRestClient = projectRestClient;
    }

    // Create module
    @PostMapping
    public ResponseEntity<Module> createModule (@RequestBody Module module) {
        Module createdModule = moduleService.createModule(module);
        return new ResponseEntity<>(createdModule, HttpStatus.CREATED);
    }

    // Get all modules
    @GetMapping("/GetAllModules")
    @ResponseStatus(HttpStatus.OK)
    public List<Module> getAllModules() {
        List <Module> modules = moduleService.getAllModules();

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

    // Get module by name
    @GetMapping("/byName/{moduleName}")
    public ResponseEntity<?> getModuleByName(@PathVariable String moduleName) {
        Optional<Module> moduleOptional = moduleService.getModuleByName(moduleName);
        return moduleOptional.map(module -> {
            // Ici, vous tentez de récupérer et d'associer les détails du projet, si projectId n'est pas null
            if (module.getProjectId() != null) {
                Project project = projectRestClient.findProjectById(module.getProjectId());
                module.setProject(project);
            }
            return ResponseEntity.ok(module);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

}
