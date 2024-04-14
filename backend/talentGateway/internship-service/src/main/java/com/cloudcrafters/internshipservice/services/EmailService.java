package com.cloudcrafters.internshipservice.services;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.sendgrid.*;
import java.io.IOException;

@Service
public class EmailService {
<<<<<<< HEAD
=======

   /* @Value("${sendgrid.api.key}")
<<<<<<< HEAD
>>>>>>> parent of 8d3d823 (Merge pull request #75 from lou4y/internship)
=======
>>>>>>> parent of 8d3d823 (Merge pull request #75 from lou4y/internship)
    private String sendgridApiKey;

    public void sendEmail(String recipient, String subject, String content) {
        Email from = new Email("noreply@nursenet.tech");
        Email to = new Email(recipient);
        Content mailContent = new Content("text/plain", content);
        Mail mail = new Mail(from, subject, to, mailContent);

        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
