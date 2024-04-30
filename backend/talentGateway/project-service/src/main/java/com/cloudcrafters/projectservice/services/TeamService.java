package com.cloudcrafters.projectservice.services;

import com.cloudcrafters.projectservice.entities.Team;

import java.util.List;
import java.util.Map;

public interface TeamService {
    List<Team> getAllTeams();
    Team getTeamById(Long id);
    Team addTeam(Team t);
    Team updateTeam(Team t);
    void deleteTeam(Team t);
    //Team getTeamDetail(Long teamId);
    void addTeamMemberToProject(Long projectId, String userId, String memberRole);
    boolean removeTeamMember(Long teamId, String userId);
}
