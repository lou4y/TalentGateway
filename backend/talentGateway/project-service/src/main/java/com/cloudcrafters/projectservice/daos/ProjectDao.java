package com.cloudcrafters.projectservice.daos;

import com.cloudcrafters.projectservice.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectDao extends JpaRepository<Project,Long> {
}
