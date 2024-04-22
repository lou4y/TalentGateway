package com.cloudcrafters.internshipservice.services;


import com.cloudcrafters.internshipservice.clients.UserRestClient;
import com.cloudcrafters.internshipservice.entites.Internship;
import com.cloudcrafters.internshipservice.models.Skill;
import com.cloudcrafters.internshipservice.models.User;
import com.pusher.client.Pusher;
import com.pusher.client.PusherOptions;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import com.sendgrid.*;
import java.io.IOException;
import java.util.List;
import java.util.Random;


@Service
public class ScheduledTasks {

    @Autowired
    private InternshipService internshipService;

    @Autowired
    private UserRestClient userRestClient;

    @Autowired
    private EmailService emailService; // Inject EmailService


    @Autowired
    private LinkedInService linkedInService; // Inject LinkedInService


    @Scheduled(fixedRate = 10000) // Run every 10 seconds
    public void checkMatchingInternshipsScheduled() {
        List<Internship> internships = internshipService.getAllInternships();
        List<User> usersWithSkills = userRestClient.getUsersWithSkills();

        if (!internships.isEmpty() && !usersWithSkills.isEmpty()) {
            for (Internship internship : internships) {
                String internshipSkills = internship.getIntershipSkills();
                for (User user : usersWithSkills) {
                    List<Skill> userSkills = user.getSkills();
                    boolean matchFound = checkSkillsMatch(internshipSkills, userSkills);
                    if (matchFound) {
                        sendNotificationEmail(user, internship);
                        linkedInService.shareInternshipOnLinkedIn(internship); // Share internship on LinkedIn

                    }
                }
            }
        }
    }

    private boolean checkSkillsMatch(String internshipSkills, List<Skill> userSkills) {
        if (internshipSkills != null && !internshipSkills.isEmpty() && userSkills != null && !userSkills.isEmpty()) {
            String[] internshipSkillsArray = internshipSkills.split(", ");
            for (String internshipSkill : internshipSkillsArray) {
                for (Skill userSkill : userSkills) {
                    if (internshipSkill.equalsIgnoreCase(userSkill.getSkillName())) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private void sendNotificationEmail(User user, Internship internship) {
        String recipientEmail = user.getEmail();
        String subject = "Internship Match Notification";
        String content = "Hello " + user.getFirstName() + ",\n\n"
                + "We found an internship that matches your skills:\n\n"
                + "Internship Title: " + internship.getIntershipTitle() + "\n"
                + "Internship Description: " + internship.getIntershipDescription() + "\n"
                + "Internship URL: http://localhost:4200/internship-details/" + internship.getIntershipId() + "\n\n"
                + "Best regards,\nInternship Service";

        emailService.sendEmail(recipientEmail, subject, content);
    }

}
