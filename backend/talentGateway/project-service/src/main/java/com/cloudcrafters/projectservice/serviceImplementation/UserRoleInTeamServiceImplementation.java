package com.cloudcrafters.projectservice.serviceImplementation;

import com.cloudcrafters.projectservice.daos.UserRoleInTeamDao;
import com.cloudcrafters.projectservice.entities.UserRoleInTeam;
import com.cloudcrafters.projectservice.services.UserRoleInTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserRoleInTeamServiceImplementation implements UserRoleInTeamService {
    @Autowired
    private UserRoleInTeamDao userRoleInTeamDao;

    @Override
    public List<UserRoleInTeam> getAll() {
        return userRoleInTeamDao.findAll();
    }

    @Override
    public List<UserRoleInTeam> getUserRolesByTeamId(Long teamId) {
        return userRoleInTeamDao.findByTeamTeamId(teamId);
    }
       /* @Override
    public List<UserRoleInTeam> getAllGroupedByTeamId() {
        return userRoleInTeamDao.findAllGroupByTeamId();
    }*/

    /* @Override
    public UserRoleInTeam getUserRoleInTeamById(Long id) {
        if(id !=null){
            final Optional<UserRoleInTeam> optionalUserRoleInTeam=userRoleInTeamDao.findById(id);
            if(optionalUserRoleInTeam.isPresent()){
                return optionalUserRoleInTeam.get();
            }

        }
        return null;
    }
   */
}
