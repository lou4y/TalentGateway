
package com.cloudcrafters.interviewservice.dto;

import com.cloudcrafters.interviewservice.model.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationRequest {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateAcceptation ;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateDePostulation;
    private String userid;
    private String offreid;
    private Status status;
}
