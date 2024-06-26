package com.cloudcrafters.userservice.keycloakclient;

import com.cloudcrafters.userservice.dto.Role;
import com.cloudcrafters.userservice.dto.User;
import com.cloudcrafters.userservice.security.KeycloakSecurityUtil;
import com.cloudcrafters.userservice.services.SkillService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.common.util.CollectionUtil;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/keycloak")
@SecurityRequirement(name = "Keycloak")
public class UserResource {
	
	@Autowired
	KeycloakSecurityUtil keycloakUtil;
	@Autowired
	SkillService skillService;
	
	@Value("${realm}")
	private String realm;
	
	@GetMapping
	@RequestMapping("/users")
	public List<User> getUsers() {
		Keycloak keycloak = keycloakUtil.getKeycloakInstance();
		List<UserRepresentation> userRepresentations = 
				keycloak.realm(realm).users().list();
		return mapUsers(userRepresentations);
    }
	@GetMapping
	@RequestMapping("/usersskills")
	public List<User> getUsersSkills() {
		Keycloak keycloak = keycloakUtil.getKeycloakInstance();
		List<UserRepresentation> userRepresentations =
				keycloak.realm(realm).users().list();
		List <User> users = mapUsers(userRepresentations);
		return users;
	}
	
	@GetMapping(value = "/users/{id}")
	public User getUser(@PathVariable("id") String id) {
		Keycloak keycloak = keycloakUtil.getKeycloakInstance();
		return mapUser(keycloak.realm(realm).users().get(id).toRepresentation());
	}
	
	@PostMapping(value = "/user/signin")
	public Response createUser(@RequestBody User user) {
		UserRepresentation userRep = mapUserRep(user);
		Keycloak keycloak = keycloakUtil.getKeycloakInstance();
		Response res = keycloak.realm(realm).users().create(userRep);
		return Response.ok(user).build();
	}
	
	@PutMapping(value = "/user")
	public Response updateUser(@RequestBody User user) {
		UserRepresentation userRep = mapUserRep(user);
		Keycloak keycloak = keycloakUtil.getKeycloakInstance();
		keycloak.realm(realm).users().get(user.getId()).update(userRep);
		return Response.ok(user).build();
	}
	
	@DeleteMapping(value = "/users/{id}")
	public Response deleteUser(@PathVariable("id") String id) {
		Keycloak keycloak = keycloakUtil.getKeycloakInstance();
		keycloak.realm(realm).users().delete(id);
		return Response.ok().build();
	}
	
	@GetMapping(value = "/users/{id}/roles")
	public List<Role> getRoles(@PathVariable("id") String id) {
		Keycloak keycloak = keycloakUtil.getKeycloakInstance();
		return RoleResource.mapRoles(keycloak.realm(realm).users()
				.get(id).roles().realmLevel().listAll());
	}

	@PostMapping(value = "/users/{id}/roles/{roleName}")
	public Response createRole(@PathVariable("id") String id, 
			@PathVariable("roleName") String roleName) {
		Keycloak keycloak = keycloakUtil.getKeycloakInstance();
		RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
		keycloak.realm(realm).users().get(id).roles().realmLevel().add(Arrays.asList(role));
		return Response.ok().build();
	}

	private List<User> mapUsers(List<UserRepresentation> userRepresentations) {
		List<User> users = new ArrayList<>();
		if(CollectionUtil.isNotEmpty(userRepresentations)) {
			userRepresentations.forEach(userRep -> {
				users.add(mapUser(userRep));
			});
		}
		return users;
	}
	
	private User mapUser(UserRepresentation userRep) {
		User user = new User();
		user.setId(userRep.getId());
		user.setFirstName(userRep.getFirstName());
		user.setLastName(userRep.getLastName());
		user.setEmail(userRep.getEmail());
		user.setUserName(userRep.getUsername());
		user.setCreatedDate(userRep.getCreatedTimestamp());
		user.setIsEmailVerified(userRep.isEmailVerified())	;

		return user;
	}
	
	private UserRepresentation mapUserRep(User user) {
		UserRepresentation userRep = new UserRepresentation();
		userRep.setId(user.getId());
		userRep.setUsername(user.getUserName());
		userRep.setFirstName(user.getFirstName());
		userRep.setLastName(user.getLastName());
		userRep.setCreatedTimestamp(user.getCreatedDate())		;
		userRep.setEmail(user.getEmail());
		userRep.setEnabled(true);
		userRep.setEmailVerified(user.getIsEmailVerified());
		List<CredentialRepresentation> creds = new ArrayList<>();
		CredentialRepresentation cred = new CredentialRepresentation();
		cred.setTemporary(false);
		cred.setValue(user.getPassword());
		creds.add(cred);
		userRep.setCredentials(creds);
		return userRep;
	}

}
