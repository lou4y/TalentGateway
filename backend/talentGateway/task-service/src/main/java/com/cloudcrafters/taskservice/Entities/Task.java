package com.cloudcrafters.taskservice.Entities;

import com.cloudcrafters.taskservice.Enums.Priority;
import com.cloudcrafters.taskservice.Enums.Statut;
import com.cloudcrafters.taskservice.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "Tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String taskName;
    private String taskDescription;
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endDate;

    private String duration;

    //Enums
    @Enumerated(EnumType.STRING)
    private Statut statut;
    @Enumerated(EnumType.STRING)
    private Priority priority;

    //Relation with Module
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_Id") // This column in the 'Task' table will reference the primary key of 'Module'
    private Module module;

    // Relation with User
    @Transient
    private User user;
    private String userId;
    private String firstName;
    private String email;
    private String password;


}
