package com.cloudcrafters.interviewservice.service;

import com.cloudcrafters.interviewservice.dto.InterviewRequest;
import com.cloudcrafters.interviewservice.dto.InterviewResponse;

import java.util.List;

public interface InterviewServiceInterface {
    InterviewResponse createInterview(String applicationId, InterviewRequest interviewRequest);
    List<InterviewResponse> getAllInterviews();
    InterviewResponse getInterviewById(String id);
    void updateInterview(String id, InterviewRequest interviewRequest);
    void deleteInterview(String id);
}
