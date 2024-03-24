package com.cloudcrafters.internshipservice.entites;

import com.cloudcrafters.internshipservice.enums.InternshipType;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "internship")
public class Internship implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long IntershipId;
    private String IntershipTitle;
    private String IntershipCompany;
    private String IntershipDescription;
    private String IntershipResponsibilities;
    private String IntershipQualifications;
    private String IntershipSkills;
    private String IntershipLocation;
    private String IntershipDuration;
    @Temporal(TemporalType.DATE)
    private Date IntershippostedDate;
    @Temporal(TemporalType.DATE)
    private Date IntershipStartDate;
    @Enumerated(EnumType.STRING)
    private InternshipType intershipType;

    @ManyToOne
    @JoinColumn(name = "CategoryId")
    private Category category;

    private String userId;
}
