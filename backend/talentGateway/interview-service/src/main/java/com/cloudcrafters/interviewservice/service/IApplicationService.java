package com.cloudcrafters.interviewservice.service;


import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
import com.cloudcrafters.interviewservice.dto.ApplicationResponse;

import com.cloudcrafters.interviewservice.model.Status;

import java.util.List;
import java.util.Map;

public interface IApplicationService {
    void createApplication(ApplicationRequest applicationRequest);

    List<ApplicationResponse> getALLApplication();

    void updateApplication(String id, ApplicationRequest applicationRequest);

    void deleteApplication(String id);

    List<ApplicationResponse> getApplicationsByUserId(String userId);

    ApplicationResponse getApplicationById(String id);


    Map<Status, Double> calculateStatusPercentage();


    List<ApplicationResponse> getApplicationsByStatus(Status status);

    Map<Status, Double> calculateStatusPercentageByUserId(String userId);

    List<ApplicationResponse> getApplicationsByOffreId(String offreId);
}

