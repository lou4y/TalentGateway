package com.cloudcrafters.projectservice.models;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.*;

import java.util.Date;

@Getter @Setter  @ToString
public class User {
    private String userId;
    private String firstName;
    private String LastName;
    private String email;
    private String password;
    @Temporal(TemporalType.DATE)
    private Date birthDate;
}
