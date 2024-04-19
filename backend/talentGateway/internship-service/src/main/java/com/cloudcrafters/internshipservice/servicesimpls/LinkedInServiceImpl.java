package com.cloudcrafters.internshipservice.servicesimpls;

import com.cloudcrafters.internshipservice.services.LinkedInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class LinkedInServiceImpl implements LinkedInService {

    @Value("${linkedin.api.url}")
    private String linkedInApiUrl; // This should be configured in your application properties

    private final RestTemplate restTemplate;

    @Autowired
    public LinkedInServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public void shareInternshipOnLinkedIn(Long internshipId) {
        // Replace "title" and "url" with actual fields from Internship entity
        String internshipTitle = "Your Internship Title";
        String internshipUrl = "http://localhost:4200/internship-details/" + internshipId; // Example URL format
        String shareUrl = linkedInApiUrl + "?title=" + internshipTitle + "&url=" + internshipUrl;

        // Send a POST request to LinkedIn API for sharing
        restTemplate.postForObject(shareUrl, null, Void.class);
    }
}