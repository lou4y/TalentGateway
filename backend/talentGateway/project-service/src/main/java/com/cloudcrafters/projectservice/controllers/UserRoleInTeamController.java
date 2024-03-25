package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.clients.UserRestClient;
import com.cloudcrafters.projectservice.entities.Team;
import com.cloudcrafters.projectservice.entities.UserRoleInTeam;
import com.cloudcrafters.projectservice.models.User;
import com.cloudcrafters.projectservice.services.TeamService;
import com.cloudcrafters.projectservice.services.UserRoleInTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
public class UserRoleInTeamController {
    @Autowired
    private UserRoleInTeamService userRoleInTeamService;
    @Autowired
    private UserRestClient userRestClient;
    @Autowired
    private TeamService teamService;

    @GetMapping("/all")
    public List<UserRoleInTeam> getAll() {
        return userRoleInTeamService.getAll();
    }

    @GetMapping("/user-roles/{teamId}")
    public List<Map<String, Object>> getUserRolesByTeamId(@PathVariable Long teamId) {
        // Récupérer l'équipe correspondante par son ID
        Team team = teamService.getTeamById(teamId);

        List<Map<String, Object>> userRoleDetails = new ArrayList<>();

        if (team != null) {
            // Récupérer les rôles des utilisateurs dans l'équipe
            Set<UserRoleInTeam> userRoles = team.getUsersWithRoles();

            boolean isFirst = true; // Flag to check if it's the first user role

            for (UserRoleInTeam userRole : userRoles) {
                // Récupérer les détails de l'utilisateur par son ID
                User user = userRestClient.findCreatorById(userRole.getUserId());

                // Créer une Map pour stocker les détails de l'utilisateur et de l'équipe
                Map<String, Object> userDetailsMap = new HashMap<>();

                if (isFirst) {
                    userDetailsMap.put("teamId", team.getTeamId());
                    userDetailsMap.put("teamName", team.getName());
                    isFirst = false;
                }

                // Ajouter les détails complets de l'utilisateur à la Map
                userDetailsMap.put("user", user);
                userDetailsMap.put("memberRole", userRole.getMemberRole());

                // Ajouter la Map à la liste
                userRoleDetails.add(userDetailsMap);
            }
        }

        return userRoleDetails;
    }


     /* @GetMapping("/grouped-by-team")
    public List<UserRoleInTeam> getAllGroupedByTeamId() {
        return userRoleInTeamService.getAllGroupedByTeamId();
    }*/

}
