package com.cloudcrafters.projectservice.daos;

import com.cloudcrafters.projectservice.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamDao extends JpaRepository<Team,Long> {
}
