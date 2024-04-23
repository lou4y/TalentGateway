package com.cloudcrafters.projectservice.daos;

import com.cloudcrafters.projectservice.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CommentDao extends JpaRepository<Comment,Long> {
    @Query("SELECT c FROM Comment c WHERE c.project.projectId = :projectId")
    List<Comment> findByProjectId(Long projectId);
}
