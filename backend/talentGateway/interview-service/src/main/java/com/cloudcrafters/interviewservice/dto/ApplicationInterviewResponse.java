
package com.cloudcrafters.interviewservice.dto;

import com.cloudcrafters.interviewservice.model.InterviewMode;
import com.cloudcrafters.interviewservice.model.Status;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;



// pour laffichage de chaque interview id pour chaque utlisateur

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationInterviewResponse {
    private Date dateDePostulation;
    private Date dateEntretien;
    private InterviewMode modaliteEntretien;
    private Status status;
    private String offreid;



}
