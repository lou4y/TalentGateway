package com.cloudcrafters.projectservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter @Setter @ToString @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name="team")
public class Team implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamId;
    private String name;
    @JsonIgnore
    @OneToMany(mappedBy = "team",cascade = CascadeType.ALL)
    private Set<Project> projects;
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private Set<UserRoleInTeam> usersWithRoles = new HashSet<>();

}
