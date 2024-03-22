package com.cloudcrafters.internshipservice.entites;

import com.cloudcrafters.internshipservice.enums.InternshipType;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Entity
@Data
@Table(name = "internship")
public class Internship  implements Serializable {
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
    private Date IntershippostedDate;
    private Date IntershipStartDate;
    private String IntershipDuration;

    private String userId;

    @Enumerated(EnumType.STRING)
    private InternshipType intershipType;

    @ManyToOne
    @JoinColumn(name = "CategoryId")
    private Category category;



    public Internship() {
    }

    public Internship(Long intershipId, String intershipTitle, String intershipCompany, String intershipDescription, String intershipResponsibilities, String intershipQualifications, String intershipSkills, String intershipLocation, Date intershippostedDate, Date intershipStartDate, String intershipDuration, String iduser, InternshipType intershipType, Category category) {
        IntershipId = intershipId;
        IntershipTitle = intershipTitle;
        IntershipCompany = intershipCompany;
        IntershipDescription = intershipDescription;
        IntershipResponsibilities = intershipResponsibilities;
        IntershipQualifications = intershipQualifications;
        IntershipSkills = intershipSkills;
        IntershipLocation = intershipLocation;
        IntershippostedDate = intershippostedDate;
        IntershipStartDate = intershipStartDate;
        IntershipDuration = intershipDuration;
        this.userId = iduser;
        this.intershipType = intershipType;
        this.category = category;
    }

    public Long getIntershipId() {
        return IntershipId;
    }

    public void setIntershipId(Long intershipId) {
        IntershipId = intershipId;
    }

    public String getIntershipTitle() {
        return IntershipTitle;
    }

    public void setIntershipTitle(String intershipTitle) {
        IntershipTitle = intershipTitle;
    }

    public String getIntershipCompany() {
        return IntershipCompany;
    }

    public void setIntershipCompany(String intershipCompany) {
        IntershipCompany = intershipCompany;
    }

    public String getIntershipDescription() {
        return IntershipDescription;
    }

    public void setIntershipDescription(String intershipDescription) {
        IntershipDescription = intershipDescription;
    }

    public String getIntershipResponsibilities() {
        return IntershipResponsibilities;
    }

    public void setIntershipResponsibilities(String intershipResponsibilities) {
        IntershipResponsibilities = intershipResponsibilities;
    }

    public String getIntershipQualifications() {
        return IntershipQualifications;
    }

    public void setIntershipQualifications(String intershipQualifications) {
        IntershipQualifications = intershipQualifications;
    }

    public String getIntershipSkills() {
        return IntershipSkills;
    }

    public void setIntershipSkills(String intershipSkills) {
        IntershipSkills = intershipSkills;
    }

    public String getIntershipLocation() {
        return IntershipLocation;
    }

    public void setIntershipLocation(String intershipLocation) {
        IntershipLocation = intershipLocation;
    }

    public Date getIntershippostedDate() {
        return IntershippostedDate;
    }

    public void setIntershippostedDate(Date intershippostedDate) {
        IntershippostedDate = intershippostedDate;
    }

    public Date getIntershipStartDate() {
        return IntershipStartDate;
    }

    public void setIntershipStartDate(Date intershipStartDate) {
        IntershipStartDate = intershipStartDate;
    }

    public String getIntershipDuration() {
        return IntershipDuration;
    }

    public void setIntershipDuration(String intershipDuration) {
        IntershipDuration = intershipDuration;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String iduser) {
        this.userId = iduser;
    }

    public InternshipType getIntershipType() {
        return intershipType;
    }

    public void setIntershipType(InternshipType intershipType) {
        this.intershipType = intershipType;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Internship{" +
                "IntershipId=" + IntershipId +
                ", IntershipTitle='" + IntershipTitle + '\'' +
                ", IntershipCompany='" + IntershipCompany + '\'' +
                ", IntershipDescription='" + IntershipDescription + '\'' +
                ", IntershipResponsibilities='" + IntershipResponsibilities + '\'' +
                ", IntershipQualifications='" + IntershipQualifications + '\'' +
                ", IntershipSkills='" + IntershipSkills + '\'' +
                ", IntershipLocation='" + IntershipLocation + '\'' +
                ", IntershippostedDate=" + IntershippostedDate +
                ", IntershipStartDate=" + IntershipStartDate +
                ", IntershipDuration='" + IntershipDuration + '\'' +
                ", iduser='" + userId + '\'' +
                ", intershipType=" + intershipType +
                ", category=" + category +
                '}';
    }
}
