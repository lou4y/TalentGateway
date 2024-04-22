package com.cloudcrafters.internshipservice.models;

import com.cloudcrafters.internshipservice.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String skillName;
    @Enumerated(EnumType.STRING)
    private SkillLevel skillLevel;
    private String userId;
}
