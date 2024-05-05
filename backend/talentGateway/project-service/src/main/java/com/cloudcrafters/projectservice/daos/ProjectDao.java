package com.cloudcrafters.projectservice.daos;

import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectDao extends JpaRepository<Project,Long> {
        @Query("SELECT p FROM Project p WHERE " +
                "(:searchCriteria IS NULL OR " +
                "(LOWER(p.projectName) LIKE %:searchCriteria% OR " +
                "LOWER(p.creatorId) LIKE %:searchCriteria% OR " +
                "LOWER(p.projectDescription) LIKE %:searchCriteria% OR " +
                "LOWER(p.projectStatus) LIKE %:searchCriteria%))")
        List<Project> searchProjects(@Param("searchCriteria") String searchCriteria);
        List<Project> findByCreatorId(String creatorId);


}
