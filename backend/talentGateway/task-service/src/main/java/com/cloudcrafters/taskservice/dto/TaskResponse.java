package com.cloudcrafters.taskservice.dto;

import com.cloudcrafters.taskservice.Entities.Module;
import com.cloudcrafters.taskservice.Enums.Priority;
import com.cloudcrafters.taskservice.Enums.Statut;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String taskName;
    private String taskDescription;
    private Date startDate;
    private Date endDate;
    private String duration;
    private Statut statut;
    private Priority priority;
    private ModuleResponse module;


    // for other MS
    private String userId;
    private String firstName;


}



