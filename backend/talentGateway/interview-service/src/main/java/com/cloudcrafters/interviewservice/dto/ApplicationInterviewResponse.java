
package com.cloudcrafters.interviewservice.dto;

import com.cloudcrafters.interviewservice.model.InterviewMode;
import com.cloudcrafters.interviewservice.model.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateDePostulation;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private Date dateEntretien;
    private InterviewMode modaliteEntretien;
    private Status status;
    private String offreid;


}
