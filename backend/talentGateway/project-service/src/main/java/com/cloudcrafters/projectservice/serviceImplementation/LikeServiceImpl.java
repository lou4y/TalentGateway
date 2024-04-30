package com.cloudcrafters.projectservice.serviceImplementation;

import com.cloudcrafters.projectservice.daos.ProjectDao;
import com.cloudcrafters.projectservice.entities.Like;
import com.cloudcrafters.projectservice.daos.LikeDao;
import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeServiceImpl implements LikeService {

    private final LikeDao likeRepository;
    private final ProjectDao projectRepository;

    @Autowired
    public LikeServiceImpl(LikeDao likeRepository,ProjectDao projectRepository) {
        this.likeRepository = likeRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public void likeProject(Long projectId, String userId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project != null) {
            Like like = new Like();
            like.setProject(project);
            like.setUserId(userId);
            like.setIsLiked(true);
            likeRepository.save(like);
        }
    }

    @Override
    public void dislikeProject(Long projectId, String userId) {
        Like like = likeRepository.findByProject_ProjectIdAndUserId(projectId, userId);
        if (like != null) {
            likeRepository.delete(like);
        }
    }


    @Override
    public int getNumberOfLikes(Long projectId) {
        return likeRepository.countByProject_ProjectIdAndIsLiked(projectId, true);
    }

    @Override
    public List<Like> getAllLikes() {
        return likeRepository.findAll();
    }

    @Override
    public boolean isUserLikedProject(Long projectId, String userId) {
        return likeRepository.existsByProject_ProjectIdAndUserIdAndIsLiked(projectId, userId, true);
    }
}