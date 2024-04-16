package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.entities.Comment;
import com.cloudcrafters.projectservice.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

}
