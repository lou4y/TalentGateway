package com.cloudcrafters.interviewservice.dto;

import com.cloudcrafters.interviewservice.model.InterviewMode;
import com.cloudcrafters.interviewservice.model.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ApplicationResponse {
    private String id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateDePostulation;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateAcceptation;
    private Status status;
    private String userid;
    private String offreid;
    private InterviewResponse interview;
    private String intershipCompany;
    private String IntershipTitle;


}
