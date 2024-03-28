package com.cloudcrafters.userservice.services;

import com.cloudcrafters.userservice.entity.Skill;
import com.cloudcrafters.userservice.enums.SkillLevel;

import java.util.List;

public interface SkillService {

    public Skill addSkill(Skill skill);
    public Skill updateSkill(Skill skill);
    public void deleteSkill(Long id);
    public Skill getSkill(Long id);
    public List<Skill> getAllSkillsByUser(String userId);
    public List<String> allSkills();

}
