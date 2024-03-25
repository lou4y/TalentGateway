package com.cloudcrafters.projectservice.entities;

import com.cloudcrafters.projectservice.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString @Builder
@Entity
@Table(name = "user_role_team")
public class UserRoleInTeam implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Transient
    private User user;
    private String userId;

    @ManyToOne
    @JoinColumn(name = "team_id")
    @JsonIgnore
    private Team team;
    private String memberRole;
}
