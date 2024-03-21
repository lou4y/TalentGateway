package com.cloudcrafters.interviewservice.dto;

import com.cloudcrafters.interviewservice.model.InterviewMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewRequest {
    private Date dateEntretien;
    private InterviewMode modaliteEntretien;


}
