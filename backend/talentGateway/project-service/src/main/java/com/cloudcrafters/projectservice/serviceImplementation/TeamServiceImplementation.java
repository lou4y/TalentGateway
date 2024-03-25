package com.cloudcrafters.projectservice.serviceImplementation;

import com.cloudcrafters.projectservice.daos.TeamDao;
import com.cloudcrafters.projectservice.entities.Team;
import com.cloudcrafters.projectservice.entities.UserRoleInTeam;
import com.cloudcrafters.projectservice.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@Service
public class TeamServiceImplementation implements TeamService {
    @Autowired
    TeamDao teamDao;
    @Override
    public List<Team> getAllTeams() {
        return teamDao.findAll();
    }

    @Override
    public Team getTeamById(Long id) {
        if(id!=null){
            final Optional<Team> optionalTeam=teamDao.findById(id);
            if(optionalTeam.isPresent())
                return optionalTeam.get();
        }
        return null;
    }

    @Override
    public Team addTeam(Team t) {
        // Save the team to get the generated teamId
        Team savedTeam = teamDao.save(t);

        // Set the teamId on each UserRoleInTeam object
        for (UserRoleInTeam userRole : savedTeam.getUsersWithRoles()) {
            userRole.setTeam(savedTeam);
        }

        // Save the team again to update the UserRoleInTeam objects
        return teamDao.save(savedTeam);
    }
    @Override
    public void deleteTeam(Team t) {
        teamDao.delete(t);

    }
    @Override
    public Team updateTeam(Team t) {
        Optional<Team> existingTeam = teamDao.findById(t.getTeamId());
        if (existingTeam.isPresent()) {
            Team updatedTeam = existingTeam.get();
            updatedTeam.setName(t.getName());

            // Update roles of existing users
            for (UserRoleInTeam updatedUserRole : t.getUsersWithRoles()) {
                for (UserRoleInTeam existingUserRole : updatedTeam.getUsersWithRoles()) {
                    if (existingUserRole.getUserId().equals(updatedUserRole.getUserId())) {
                        existingUserRole.setMemberRole(updatedUserRole.getMemberRole());
                        break;
                    }
                }
            }

            return teamDao.save(updatedTeam);
        } else {
            // Handle if team with given ID doesn't exist
            return null;
        }
    }


    /*@Override
    public Team getTeamDetail(Long teamId) {
        Team team = teamDao.findById(teamId).orElse(null);
        Map<String, String> usersWithRoles = new HashMap<>();
        if (team != null) {
            for (UserRoleInTeam userRoleInTeam : team.getUsersWithRoles()) {
                usersWithRoles.put(userRoleInTeam.getUserId(), userRoleInTeam.getMemberRole());
            }
        }
        return usersWithRoles;
    }*/
}
