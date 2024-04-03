package com.cloudcrafters.taskservice.Entities;

import com.cloudcrafters.taskservice.models.Project;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    //Relation with Project
    @Transient // Ne pas inclure project dans la réponse JSON
    // ne pas inclure project dans la creation de module
    //@JsonIgnore
    private Project project;
    // Ne pas inclure projectId dans la réponse JSON

    @JsonProperty // Permet la désérialisation
    private Long projectId;


}
