package com.cloudcrafters.internshipservice.entites;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
@Getter
@Setter
@AllArgsConstructor
@Builder
@ToString
@NoArgsConstructor
@Entity
@Table(name = "ratings")
public class Rating implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;

    @ManyToOne
    @JoinColumn(name = "internship_id")
    private Internship internship;

    private String userId;

    // Getters and setters
}