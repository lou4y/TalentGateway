package com.cloudcrafters.taskservice.models;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class User {
    private String id;
    private String firstName;
    private String LastName;
    private String email;
    private String password;
    private String Skills;
    @Temporal(TemporalType.DATE)
    private Date birthDate;
}
