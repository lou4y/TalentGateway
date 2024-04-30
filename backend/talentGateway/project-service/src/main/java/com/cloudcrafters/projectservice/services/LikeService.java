package com.cloudcrafters.projectservice.services;

import com.cloudcrafters.projectservice.entities.Like;

import java.util.List;

public interface LikeService {
    boolean isUserLikedProject(Long projectId, String userId);
    void likeProject(Long projectId, String userId);
    void dislikeProject(Long projectId, String userId);
    int getNumberOfLikes(Long projectId);
    List<Like> getAllLikes();
}
