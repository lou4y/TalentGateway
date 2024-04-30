package com.cloudcrafters.projectservice.services;

import com.cloudcrafters.projectservice.entities.Comment;
import com.cloudcrafters.projectservice.entities.Project;

import java.util.List;
import java.util.Map;

public interface CommentService {
    public List<Comment> getAllComments();
    public List<Comment> getCommentsByProjectId(Long projectId);
    Comment addComment(Comment comment, Long projectId,String userId);
    Map<Project, Long> getProjectCommentCounts();
}
