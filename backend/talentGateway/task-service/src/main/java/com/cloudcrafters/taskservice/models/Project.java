package com.cloudcrafters.taskservice.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter @Setter @ToString
public class Project {
    private Long projectId;
    private String projectName;
    private String projectDescription;


    private Date startDate;

    private Date endTime;
    private double price;





}

