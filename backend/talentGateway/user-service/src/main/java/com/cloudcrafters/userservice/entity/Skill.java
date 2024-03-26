package com.cloudcrafters.userservice.entity;

import com.cloudcrafters.userservice.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "skills")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String skillName;
    @Enumerated(EnumType.STRING)
    private SkillLevel skillLevel;
    private String userId;
}
