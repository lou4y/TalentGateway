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
    public Team getTeamById(@PathVariable Long id){
        Team team=teamService.getTeamById(id);
        //User teamMember=userRestClient.findCreatorById()

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
