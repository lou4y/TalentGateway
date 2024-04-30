package com.cloudcrafters.userservice.entity;

import com.cloudcrafters.userservice.enums.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "additional_user_data")
public class AdditionalUserData {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String address;
    private String city;
    private String state;
    @Temporal(TemporalType.DATE)
    private Date Birthdate;
    private String description;
    private String phoneNumber;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String profilePicture;
    private String PdfFile;
}
