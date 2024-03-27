package com.cloudcrafters.taskservice.Entities;

import com.cloudcrafters.taskservice.models.Project;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;


@Entity
@Table(name = "Modules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Module implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long moduleId;
    private String moduleName;
    private String moduleDescription;

    @Transient
    private Project project;
    private Long projectId;


}
