package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.clients.UserRestClient;
import com.cloudcrafters.projectservice.entities.Team;
import com.cloudcrafters.projectservice.entities.UserRoleInTeam;
import com.cloudcrafters.projectservice.models.User;
import com.cloudcrafters.projectservice.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@CrossOrigin(origins = "*")
public class TeamController {
    @Autowired
    private TeamService teamService;
    @Autowired
    private UserRestClient userRestClient;

    @GetMapping("/teams")
    public List<Team> getAllTeams(){
        return teamService.getAllTeams();
    }
    @GetMapping("/teams/{id}")
    public Team getTeamById(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);

        // Fetching user details for each team member
        for (UserRoleInTeam userRole : team.getUsersWithRoles()) {
            User user = userRestClient.findCreatorById(userRole.getUserId());
            userRole.setUser(user);
        }

        return team;
    }

    @PostMapping("/teams")
    public Team addNewTeam(@RequestBody Team team){return  teamService.addTeam(team);}
    @PutMapping("/teams/{id}")
    public Team updateTeam(@RequestBody Team team, @PathVariable Long id){
        team.setTeamId(id);
        return teamService.updateTeam(team);
    }
    @DeleteMapping("/teams/{id}")
    public ResponseEntity<String> deleteTeam(@PathVariable Long id){
        Team team= teamService.getTeamById(id);
        if(team!=null){
            teamService.deleteTeam(team);
            return ResponseEntity.ok("team deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("team not found");
        }
    }
    @PostMapping("/teams/add-member")
    public ResponseEntity<String> addTeamMemberToProject(@RequestParam("projectId") Long projectId,
                                                         @RequestParam("userId") String userId,
                                                         @RequestParam("memberRole") String memberRole) {
        try {
            teamService.addTeamMemberToProject(projectId, userId, memberRole);
            return ResponseEntity.ok("Team member added successfully.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());  // Retourne le message de l'exception
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("An error occurred while adding the team member.");
        }
    }
    @DeleteMapping("/teams/{teamId}/members/{userId}")
    public ResponseEntity<String> removeTeamMember(@PathVariable Long teamId, @PathVariable String userId) {
        try {
            boolean success = teamService.removeTeamMember(teamId, userId);
            if (success) {
                return ResponseEntity.ok("Team member removed successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Team member not found.");
            }
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("An error occurred while removing the team member.");
        }
    }

   /* @GetMapping("/teams-detail/{id}")
    public Map<String, Object> getTeamDetailById(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);
        if (team != null) {
            Map<String, Object> teamDetail = new HashMap<>();
            teamDetail.put("teamName", team.getName());

            List<Map<String, Object>> members = new ArrayList<>();
            for (UserRoleInTeam userRoleInTeam : team.getUsersWithRoles()) {
                User user = userRestClient.findCreatorById(userRoleInTeam.getUserId());
                Map<String, Object> memberDetail = new HashMap<>();
                memberDetail.put("userId", userRoleInTeam.getUserId());
                memberDetail.put("memberRole", userRoleInTeam.getMemberRole());
                memberDetail.put("memberName", user.getFirstName() + " " + user.getLastName());
                members.add(memberDetail);
            }
            teamDetail.put("members", members);
            return teamDetail;
        }
        return null;
    }*/

}
