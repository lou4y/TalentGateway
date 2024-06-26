package com.cloudcrafters.projectservice.entities;

import com.cloudcrafters.projectservice.enums.ProjectStatus;
import com.cloudcrafters.projectservice.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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
    private String projectFile;
    @Enumerated(EnumType.STRING)
    private ProjectStatus projectStatus;
    //@JsonIgnore
    @Transient
    private User projectCreator;
    private String creatorId;
    @ManyToOne
    private Team team;
    @JsonIgnore
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private Set<Comment> comments= new HashSet<>();
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    @JsonIgnore // Exclude likes from serialization
    private Set<Like> likes = new HashSet<>();


}
