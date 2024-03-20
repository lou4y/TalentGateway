package com.cloudcrafters.projectservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter @Setter @ToString @AllArgsConstructor @NoArgsConstructor @Builder
@Entity
@Table(name = "projects")
public class Project {
    public enum ProjectStatus {
        PLANNING,
        IN_PROGRESS,
        COMPLETED,
        ON_HOLD,
        CANCELED
    }
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;
    private String projectName;
    private String projectDescription;
    @Temporal(TemporalType.DATE)
    private Date startDate;
    @Temporal(TemporalType.DATE)
    private Date endTime;
    private double price;
    private ProjectStatus projectStatus;


}
