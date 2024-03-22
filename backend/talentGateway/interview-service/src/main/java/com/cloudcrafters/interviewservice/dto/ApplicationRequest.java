
package com.cloudcrafters.interviewservice.dto;

import com.cloudcrafters.interviewservice.model.Status;
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
    private Date dateAcceptation ;
    @Temporal(TemporalType.DATE)
    private Date dateDePostulation;
    private String userid;
    private String offreid;
    private Status status;
}
