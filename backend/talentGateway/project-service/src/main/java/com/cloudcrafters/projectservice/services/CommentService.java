package com.cloudcrafters.projectservice.services;

import com.cloudcrafters.projectservice.entities.Comment;

import java.util.List;

public interface CommentService {
    public List<Comment> getAllComments();
    public List<Comment> getCommentsByProjectId(Long projectId);
    Comment addComment(Comment comment, Long projectId,String userId);
}
