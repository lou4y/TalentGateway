package com.cloudcrafters.internshipservice.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

import java.util.Collections;

@Service
public class LinkedInService {
    @Value("${linkedin.accessToken}")
    private String accessToken; // Inject access token from properties file or environment variables

    private final RestTemplate restTemplate;

    public LinkedInService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void shareInternship(String internshipTitle, String internshipDescription) {
        // Construct the LinkedIn post data
        String postContent = "Check out this exciting internship opportunity!\n"
                + "Title: " + internshipTitle + "\n"
                + "Description: " + internshipDescription + "\n";


        // Set up the request headers with the access token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Set up the request body with the post content
        JSONObject postData = new JSONObject();
        postData.put("author", "urn:li:person:" ); // Assuming userId is in LinkedIn format
        postData.put("lifecycleState", "PUBLISHED");
        postData.put("specificContent", Collections.singletonMap("com.linkedin.ugc.ShareContent",
                Collections.singletonMap("shareCommentary",
                        Collections.singletonList(Collections.singletonMap("text", postContent)))));

        HttpEntity<String> requestEntity = new HttpEntity<>(postData.toString(), headers);

        // Send the request to LinkedIn API to create a post
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "https://api.linkedin.com/v2/shares",
                HttpMethod.POST,
                requestEntity,
                String.class);

        // Check the response status and handle accordingly
        if (responseEntity.getStatusCode() == HttpStatus.CREATED) {
            System.out.println("Internship shared on LinkedIn successfully!");
        } else {
            System.out.println("Failed to share internship on LinkedIn. Status code: " + responseEntity.getStatusCode());
            System.out.println("Response: " + responseEntity.getBody());
        }
    }
}