package com.cloudcrafters.projectservice.entities;

import com.cloudcrafters.projectservice.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;


@Entity
@Table(name = "comments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class Comment implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;
    private String commentContent;
    @ManyToOne
    private Project project;
    @Temporal(TemporalType.DATE)
    private Date commentDate;
    @Transient
    private User user;
    private String userId;
    private String sentiment;
}
