package com.cloudcrafters.projectservice.controllers;

import com.cloudcrafters.projectservice.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class LikeController {

    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/like/{projectId}")
    public void likeProject(@PathVariable Long projectId, @RequestParam String userId) {
        likeService.likeProject(projectId, userId);
    }

    @DeleteMapping("/dislike/{projectId}")
    public void dislikeProject(@PathVariable Long projectId, @RequestParam String userId) {
        likeService.dislikeProject(projectId, userId);
    }
    @GetMapping("/count/{projectId}")
    public int getNumberOfLikes(@PathVariable Long projectId) {
        return likeService.getNumberOfLikes(projectId);
    }
    @GetMapping("/isliked/{projectId}")
    public boolean isUserLikedProject(@PathVariable Long projectId, @RequestParam String userId) {
        return likeService.isUserLikedProject(projectId, userId);
    }

}
