package com.cloudcrafters.projectservice.daos;

import com.cloudcrafters.projectservice.entities.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeDao extends JpaRepository<Like, Long> {
    int countByProject_ProjectIdAndIsLiked(Long projectId, boolean isLiked);
    boolean existsByProject_ProjectIdAndUserIdAndIsLiked(Long projectId, String userId, boolean isLiked);
    Like findByProject_ProjectIdAndUserId(Long projectId, String userId);

}
