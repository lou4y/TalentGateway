package com.cloudcrafters.interviewservice.service;

import com.cloudcrafters.interviewservice.dto.ApplicationInterviewResponse;
import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
import com.cloudcrafters.interviewservice.dto.ApplicationResponse;
import com.cloudcrafters.interviewservice.dto.InterviewResponse;
import com.cloudcrafters.interviewservice.model.Application;
import com.cloudcrafters.interviewservice.model.Status;

import java.util.List;
import java.util.Map;

public interface IApplicationService {
    void createApplication(ApplicationRequest applicationRequest);

    List<ApplicationResponse> getALLApplication();

    void updateApplication(String id, ApplicationRequest applicationRequest);

    void deleteApplication(String id);

    List<ApplicationInterviewResponse> getInterviewsByUserId(String userId);

    ApplicationResponse getApplicationById(String id);


    Map<Status, Double> calculateStatusPercentage();


  //  List<Application> getApplicationsByStatusAndOffreId(Status status, String offreId);

    //List<ApplicationResponse> getApplicationsByOffreId(String offreId);

    Map<Status, Double> calculateStatusPercentageByUserId(String userId);
}

