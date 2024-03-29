package com.cloudcrafters.messagingservice.entities;

import com.cloudcrafters.messagingservice.enums.*;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.*;

@Getter
@Setter
@Document
public class User
{
    @Id
    private String nickName;
    private String fullName;
    private Status status;



}
