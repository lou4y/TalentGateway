package com.cloudcrafters.projectservice.services;


import com.cloudcrafters.projectservice.entities.UserRoleInTeam;

import java.util.List;

public interface UserRoleInTeamService {

    List<UserRoleInTeam> getAll();
    List<UserRoleInTeam> getUserRolesByTeamId(Long teamId);
    //UserRoleInTeam getUserRoleInTeamById(Long id);
    /* List<UserRoleInTeam> getAllGroupedByTeamId();*/
}
