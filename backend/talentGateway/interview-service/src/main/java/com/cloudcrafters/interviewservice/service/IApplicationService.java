package com.cloudcrafters.interviewservice.service;

import com.cloudcrafters.interviewservice.dto.ApplicationInterviewResponse;
import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
import com.cloudcrafters.interviewservice.dto.ApplicationResponse;
import com.cloudcrafters.interviewservice.dto.InterviewResponse;

import java.util.List;

public interface IApplicationService {
    void createApplication(ApplicationRequest applicationRequest);

    List<ApplicationResponse> getALLApplication();

    void updateApplication(String id, ApplicationRequest applicationRequest);

    void deleteApplication(String id);

    List<ApplicationInterviewResponse> getInterviewsByUserId(String userId);
}