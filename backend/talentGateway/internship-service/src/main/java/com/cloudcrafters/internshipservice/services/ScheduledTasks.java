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
<<<<<<< HEAD
    private EmailService emailService; // Inject EmailService

=======
   private EmailService emailService; // Inject EmailService
/*
>>>>>>> parent of 8d3d823 (Merge pull request #75 from lou4y/internship)
    @Scheduled(fixedRate = 10000) // Run every 10 seconds
    public void getRandomInternshipScheduled() {
        List<Internship> internships = internshipService.getAllInternships();
        if (!internships.isEmpty()) {
            for (Internship internship : internships) {
                String internshipSkills = internship.getIntershipSkills();
                List<Skill> userSkills = userRestClient.findSkillsByUserId("5db6b347-d4eb-4255-b08d-7dd9549b1377");
                boolean matchFound = checkSkillsMatch(internshipSkills, userSkills);
                if (matchFound) {
                    User user = userRestClient.findUserById("5db6b347-d4eb-4255-b08d-7dd9549b1377");
                    if (user != null && user.getEmail() != null) {
                        emailService.sendEmail(user.getEmail(), "Internship Match", "Match found for Internship: " + internship.getIntershipTitle());
                    }
                }
            }
        }
    }
<<<<<<< HEAD

=======
*/
>>>>>>> parent of 8d3d823 (Merge pull request #75 from lou4y/internship)
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

}
