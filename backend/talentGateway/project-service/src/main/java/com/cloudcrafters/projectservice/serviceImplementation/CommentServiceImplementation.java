package com.cloudcrafters.projectservice.serviceImplementation;

import com.cloudcrafters.projectservice.clients.UserRestClient;
import com.cloudcrafters.projectservice.daos.CommentDao;
import com.cloudcrafters.projectservice.entities.Comment;
import com.cloudcrafters.projectservice.entities.Project;
import com.cloudcrafters.projectservice.models.User;
import com.cloudcrafters.projectservice.services.CommentService;
import com.cloudcrafters.projectservice.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentServiceImplementation implements CommentService {
    @Autowired
    private CommentDao commentDao;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private UserRestClient userRestClient;
    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;
    @Override
    public List<Comment> getAllComments() {
        return commentDao.findAll();
    }

    @Override
    public List<Comment> getCommentsByProjectId(Long projectId) {
        if (projectId != null) {
            List<Comment> comments = commentDao.findByProjectId(projectId);
            for (Comment comment : comments) {
                User user = userRestClient.findCreatorById(comment.getUserId());
                comment.setUser(user);
            }
            return comments;
        }
        return null;
    }

    @Override
    public Comment addComment(Comment comment, Long projectId,String userId) {
        if(projectId!=null){
            if(userId!=null){
                Project project= projectService.getProjectById(projectId);
                comment.setProject(project);
                comment.setUserId(userId);
                comment.setCommentDate(new Date());
                String sentiment = sentimentAnalysisService.analyzeSentiment(comment.getCommentContent());
                comment.setSentiment(sentiment);

                return commentDao.save(comment);
            }
        }
        return commentDao.save(comment);
    }
    @Override
    public Map<Project, Long> getProjectCommentCounts() {
        return commentDao.findAll()
                .stream()
                .filter(comment -> "positive".equalsIgnoreCase(comment.getSentiment())) // Filtre les commentaires positifs
                .collect(Collectors.groupingBy(Comment::getProject, Collectors.counting()));
    }
}
