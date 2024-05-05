package com.cloudcrafters.taskservice.Mailgun;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class MailService {

    @Autowired
    private MailgunProperties mailgunProperties;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendEmail(String to, String subject, String text) {
        try {
            String url = "https://api.mailgun.net/v3/" + mailgunProperties.getDomain() + "/messages";
            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth("api", mailgunProperties.getApiKey());
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("from", mailgunProperties.getFromEmail());
            body.add("to", to);
            body.add("subject", subject);
            body.add("text", text);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("Mailgun response: " + response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
