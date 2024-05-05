package com.cloudcrafters.userservice.dto;

import com.cloudcrafters.userservice.entity.Skill;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class User {
	
	private String id;

	private String firstName;
	
	private String lastName;
	
	private String email;
	
	private String userName;
	
	private String password;

	private Boolean isEmailVerified = false;



	
	
}
