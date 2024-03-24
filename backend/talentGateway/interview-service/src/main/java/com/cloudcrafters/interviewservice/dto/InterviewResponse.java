package com.cloudcrafters.interviewservice.dto;

import com.cloudcrafters.interviewservice.model.Application;
import com.cloudcrafters.interviewservice.model.InterviewMode;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponse {
    private String id;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private Date dateEntretien;
    private InterviewMode modaliteEntretien;


}
