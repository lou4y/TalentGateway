package com.cloudcrafters.userservice.controller;

import com.cloudcrafters.userservice.entity.Skill;
import com.cloudcrafters.userservice.enums.SkillLevel;
import com.cloudcrafters.userservice.services.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.loadbalancer.Response;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profile")
public class SkillController {
    @Autowired
    private SkillService skillService;

    @PostMapping(value = "/skill")
    public Skill addSkill(@RequestBody Skill skill) {
        return this.skillService.addSkill(skill);

    }

    @PutMapping(value = "/skill")
    public Skill updateSkill(@RequestBody Skill skill) {
        return this.skillService.updateSkill(skill);

    }

    @DeleteMapping(value = "/skill/{id}")
    public void deleteSkill(@PathVariable Long id) {
        this.skillService.deleteSkill(id);
    }

    @GetMapping(value = "/skill/{id}")
    public Skill getSkill(@PathVariable Long id) {
       return this.skillService.getSkill(id);
    }

    @GetMapping(value = "/skills/{userId}")
    public List<Skill> getAllSkillsByUser(@PathVariable String userId) {
       return this.skillService.getAllSkillsByUser(userId);
    }
    @GetMapping(value = "/Allskills")
    public List<String> allSkills() {
        return this.skillService.allSkills();
    }

}
