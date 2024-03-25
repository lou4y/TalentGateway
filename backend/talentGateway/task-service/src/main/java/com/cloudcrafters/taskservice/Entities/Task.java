package com.cloudcrafters.taskservice.Entities;

import com.cloudcrafters.taskservice.Enums.Priority;
import com.cloudcrafters.taskservice.Enums.Statut;
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
    @JoinColumn(name = "module_id") // This column in the 'Task' table will reference the primary key of 'Module'
    private Module module;

    // test for user
    private String userId;
}
