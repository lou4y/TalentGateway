package com.cloudcrafters.internshipservice.entites;

import com.cloudcrafters.internshipservice.enums.InternshipType;
import com.cloudcrafters.internshipservice.models.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@Builder
@ToString
@NoArgsConstructor
@Entity
@Table(name = "categories")
public class Category implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long CategoryId;
    private String categoryName;
    private String categoryDescription;

    @ManyToMany(mappedBy = "categories", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnoreProperties("categories")
    private Set<Internship> internships = new HashSet<>();



    private String userId;

    // Setter method for setting the creator of the internship
    public void setCreator(User creator) {
        this.userId = creator.getUserId();
    }
}
