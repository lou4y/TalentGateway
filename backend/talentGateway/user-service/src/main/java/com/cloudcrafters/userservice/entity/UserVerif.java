package com.cloudcrafters.userservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_verif")
public class UserVerif {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String userId;
    private boolean isRoleVerified = false;
    private boolean isDataVerified  = false;
    private boolean isBanned = false;
}
