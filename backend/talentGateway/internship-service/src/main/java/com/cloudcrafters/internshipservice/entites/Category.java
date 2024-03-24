package com.cloudcrafters.internshipservice.entites;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor @Builder
@Entity
@Data
@Table(name = "category")
public class Category implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long CategoryId;
    private String CategoryName;
    private String CategoryDescription;
    @OneToMany(mappedBy = "category")
    private List<Internship> interships;
    public Category(Long id, String name, String description) {
        this.CategoryId = id;
        this.CategoryName = name;
        this.CategoryDescription = description;
    }


}
