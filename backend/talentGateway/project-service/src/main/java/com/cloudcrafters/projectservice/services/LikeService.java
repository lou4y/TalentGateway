package com.cloudcrafters.projectservice.services;

public interface LikeService {
    boolean isUserLikedProject(Long projectId, String userId);
    void likeProject(Long projectId, String userId);
    void dislikeProject(Long projectId, String userId);
    int getNumberOfLikes(Long projectId);
}
