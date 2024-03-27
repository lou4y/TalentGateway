package com.cloudcrafters.userservice.servicesImpl;

import com.cloudcrafters.userservice.dao.SkillDao;
import com.cloudcrafters.userservice.entity.Skill;
import com.cloudcrafters.userservice.services.SkillService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    @Resource
    private SkillDao skillDao;

    @Override
    public Skill addSkill(Skill skill) {
        return this.skillDao.save(skill);
    }

    @Override
    public Skill updateSkill(Skill skill) {
        Skill existingSkill = this.skillDao.getOne(skill.getId());
        existingSkill.setSkillName(skill.getSkillName());
        existingSkill.setSkillLevel(skill.getSkillLevel());
        existingSkill.setUserId(skill.getUserId());
        return this.skillDao.save(existingSkill);
    }

    @Override
    public void deleteSkill(Long id) {
        this.skillDao.deleteById(id);
    }

    @Override
    public Skill getSkill(Long id) {
        return this.skillDao.findById(id).orElse(null);
    }

    @Override
    public List<Skill> getAllSkillsByUser(String userId) {
        return this.skillDao.findByUserId(userId);
    }

    @Override
    public List<String> allSkills() {
        return this.skillDao.findDistinctSkillNames();
    }
}
