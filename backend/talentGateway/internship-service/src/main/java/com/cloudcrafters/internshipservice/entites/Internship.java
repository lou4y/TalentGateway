package com.cloudcrafters.internshipservice.entites;

import com.cloudcrafters.internshipservice.enums.InternshipType;
import com.cloudcrafters.internshipservice.models.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@Builder
@ToString
@NoArgsConstructor
@Entity
@Table(name = "internships")
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

    @ManyToMany(cascade = { CascadeType.ALL })
    @JoinTable(
            name = "internships_categories",
            joinColumns = {
                    @JoinColumn(name = "internship_id")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "category_id")
            }
    )
    @JsonIgnoreProperties("internships")// to avoid infinite recursion
    private Set<Category> categories = new HashSet<>();

    private String userId;


    // Setter method for setting the creator of the internship
    public void setCreator(User creator) {
        // Implement your logic here to set the creator
        // For example:
        this.userId = creator.getUserId();
    }
}


