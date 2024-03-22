package com.cloudcrafters.projectservice.entities;

import com.cloudcrafters.projectservice.enums.ProjectStatus;
import com.cloudcrafters.projectservice.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Getter @Setter @ToString @AllArgsConstructor @NoArgsConstructor @Builder
@Entity
@Table(name = "projects")
public class Project implements Serializable {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;
    private String projectName;
    private String projectDescription;
    @Temporal(TemporalType.DATE)
    private Date startDate;
    @Temporal(TemporalType.DATE)
    private Date endTime;
    private double price;
    @Enumerated(EnumType.STRING)
    private ProjectStatus projectStatus;
    @Transient
    private User projectCreator;
    private String creatorId;



}
