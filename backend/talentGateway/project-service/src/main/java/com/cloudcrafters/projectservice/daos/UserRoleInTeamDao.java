package com.cloudcrafters.projectservice.daos;

import com.cloudcrafters.projectservice.entities.UserRoleInTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Repository
public interface UserRoleInTeamDao extends JpaRepository<UserRoleInTeam,Long> {
    //@Query("SELECT DISTINCT urit FROM UserRoleInTeam urit JOIN FETCH urit.team")
    //List<UserRoleInTeam> findAllGroupByTeamId();
    List<UserRoleInTeam> findByTeamTeamId(Long teamId);
}
