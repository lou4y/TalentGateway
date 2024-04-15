package com.cloudcrafters.projectservice.entities;

import com.cloudcrafters.projectservice.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
@Entity
@Table(name = "likes")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class Like implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeId;
    @ManyToOne
    private Project project;
    @Transient
    private User user;
    private String userId;
    private Boolean isLiked;
}
