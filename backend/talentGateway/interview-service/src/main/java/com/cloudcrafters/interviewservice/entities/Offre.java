package com.cloudcrafters.interviewservice.entities;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class Offre {
    private Long IntershipId;
    private String IntershipTitle;
    private String IntershipCompany;
    private String IntershipDescription;
    private String IntershipResponsibilities;
    private String IntershipQualifications;
    private String IntershipSkills;
    private String IntershipLocation;
}
