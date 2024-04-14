package com.cloudcrafters.internshipservice.models;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
public class User {
    private String userId;
    private String firstName;
    private String LastName;
    private String email;
    private String password;
    private List<Skill> skills; // Add skills field

    @Temporal(TemporalType.DATE)
    private Date birthDate;
}
