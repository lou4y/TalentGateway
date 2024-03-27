package com.cloudcrafters.userservice.dao;

import com.cloudcrafters.userservice.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SkillDao extends JpaRepository<Skill, Long> {
    List<Skill> findByUserId(String userId);
    @Query(value = "SELECT DISTINCT s.skillName FROM Skill s")
    List<String> findDistinctSkillNames();
}
