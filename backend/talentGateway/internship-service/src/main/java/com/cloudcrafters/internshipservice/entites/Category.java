package com.cloudcrafters.internshipservice.entites;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

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

    public Category() {
    }
    public Category(Long id, String name, String description) {
        this.CategoryId = id;
        this.CategoryName = name;
        this.CategoryDescription = description;
    }

    public Long getCategoryId() {
        return CategoryId;
    }

    public void setCategoryId(Long id) {
        this.CategoryId = id;
    }

    public String getCategoryName() {
        return CategoryName;
    }

    public void setCategoryName(String name) {
        this.CategoryName = name;
    }

    public String getCategoryDescription() {
        return CategoryDescription;
    }

    public void setCategoryDescription(String description) {
        this.CategoryDescription = description;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + CategoryId +
                ", name='" + CategoryName + '\'' +
                ", description='" + CategoryDescription + '\'' +
                '}';
    }
}
