package com.cloudcrafters.internshipservice.services;

import com.cloudcrafters.internshipservice.entites.Internship;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class LinkedInService {

    @Value("${linkedin.api.base-url}")
    private String apiUrl; // LinkedIn API base URL

    @Value("${linkedin.api.client-secret}")
    private String accessToken; // Access token obtained during OAuth 2.0 flow

    private final RestTemplate restTemplate;

    @Autowired
    public LinkedInService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Method to share internship information on LinkedIn
    public void shareInternshipOnLinkedIn(Internship internship) {
        String shareUrl = apiUrl + "/v2/shares"; // LinkedIn API endpoint for sharing content

        // Create a LinkedIn post payload
        String postContent = "New Internship Opportunity: " + internship.getIntershipTitle()
                + "\nCompany: " + internship.getIntershipCompany()
                + "\nDescription: " + internship.getIntershipDescription()
                + "\nLocation: " + internship.getIntershipLocation();

        // Set up the request headers with the access token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("content", Collections.singletonMap("text", postContent));

        // Make a POST request to share the content on LinkedIn
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(shareUrl, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.CREATED) {
            System.out.println("Internship shared successfully on LinkedIn!");
        } else {
            System.err.println("Failed to share internship on LinkedIn. Status code: " + response.getStatusCodeValue());
        }
    }
}