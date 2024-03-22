
package com.cloudcrafters.interviewservice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(value = "application")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {
    @Id
    private String id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateAcceptation ;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateDePostulation ;

    private Status status;
    private String userid;
    private String offreid;
    @DBRef
    private Interview interview;

}
