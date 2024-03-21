package com.cloudcrafters.interviewservice.model;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
@Document(value = "interview")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {
@Id
    private String id;
    @Temporal(TemporalType.DATE)
    private Date dateentretien;

    private InterviewMode modaliteEntretien;
    @DBRef
    private Application application;


}
