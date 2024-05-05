package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.entities.Comment;
import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class CommentController {
    @Autowired
    private CommentService commentService;
    @GetMapping("comments")
    public List<Comment> getAllComments(){
        return commentService.getAllComments();
    }
    @GetMapping("comments/{projectId}")
    public List<Comment> getCommentsByProjectId(@PathVariable Long projectId){
        return commentService.getCommentsByProjectId(projectId);
    }
    @PostMapping("comments")
    public Comment addComment(@RequestBody Comment comment, @RequestParam Long projectId, @RequestParam String userId) {
        return commentService.addComment(comment, projectId, userId);
    }
    @GetMapping("/top-positive-comments")
    public List<Project> getTopProjectsWithPositiveComments() {
        Map<Project, Long> projectCommentCounts = commentService.getProjectCommentCounts();

        // Trier les projets par nombre de commentaires positifs décroissant
        return projectCommentCounts.entrySet()
                .stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue())) //
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

}
