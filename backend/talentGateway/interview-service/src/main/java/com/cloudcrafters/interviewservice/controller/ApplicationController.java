package com.cloudcrafters.interviewservice.controller;


import com.cloudcrafters.interviewservice.clients.OffreRestClient;
import com.cloudcrafters.interviewservice.clients.UserRestClient;
import com.cloudcrafters.interviewservice.dto.ApplicationInterviewResponse;
import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
import com.cloudcrafters.interviewservice.dto.ApplicationResponse;

import com.cloudcrafters.interviewservice.entities.Offre;

import com.cloudcrafters.interviewservice.model.Status;
import com.cloudcrafters.interviewservice.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/application")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    @Autowired
    UserRestClient userRestClient;

    @Autowired
    OffreRestClient offreRestClient;


    // @PostMapping
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createApplication(@RequestBody ApplicationRequest applicationRequest) {
        applicationService.createApplication(applicationRequest);
    }


    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApplicationResponse getApplicationById(@PathVariable String id) {
        ApplicationResponse applicationResponse = applicationService.getApplicationById(id);
        // Récupérer l'offre de l'application
        Offre offre = offreRestClient.findOffreById(applicationResponse.getOffreid());
        // Mettre à jour uniquement le champ intershipCompany dans l'objet ApplicationResponse
        applicationResponse.setIntershipCompany(offre.getIntershipCompany());
        applicationResponse.setIntershipTitle(offre.getIntershipTitle());
        // Retourner uniquement l'ApplicationResponse avec le champ intershipCompany rempli
        return applicationResponse;
    }


    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<ApplicationResponse> getALLApplication() {
        List<ApplicationResponse> allApplications = applicationService.getALLApplication();

        for (ApplicationResponse applicationResponse : allApplications) {
            // Récupérer l'offre de l'application
            Offre offre = offreRestClient.findOffreById(applicationResponse.getOffreid());
            // Mettre à jour uniquement le champ intershipCompany dans l'objet ApplicationResponse
            applicationResponse.setIntershipCompany(offre.getIntershipCompany());
            applicationResponse.setIntershipTitle(offre.getIntershipTitle());

        }

        return allApplications;
    }


    // Endpoint pour mettre à jour une application
    //  @PutMapping("/{id}")
    @PutMapping("/update/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateApplication(@PathVariable String id, @RequestBody ApplicationRequest applicationRequest) {
        applicationService.updateApplication(id, applicationRequest);
    }

    // Endpoint pour supprimer une application
    //@DeleteMapping("/{id}")
    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteApplication(@PathVariable String id) {
        applicationService.deleteApplication(id);
    }


    @GetMapping("/interviews/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<ApplicationInterviewResponse> getInterviewsByUserId(@PathVariable String userId) {
        List<ApplicationInterviewResponse> interviewResponses = applicationService.getInterviewsByUserId(userId);

        // Parcourir chaque élément de la liste et mettre à jour le champ intershipCompany
        for (ApplicationInterviewResponse interviewResponse : interviewResponses) {
            Offre offre = offreRestClient.findOffreById(interviewResponse.getOffreid());
            interviewResponse.setIntershipCompany(offre.getIntershipCompany());
            interviewResponse.setIntershipTitle(offre.getIntershipTitle());
        }

        // Retourner la liste mise à jour
        return interviewResponses;
    }


    // aficher le % pour tout les application du notre site
    @GetMapping("/statusPercentage")
    public ResponseEntity<Map<Status, Double>> getStatusPercentage() {
        Map<Status, Double> statusPercentage = applicationService.calculateStatusPercentage();
        return new ResponseEntity<>(statusPercentage, HttpStatus.OK);
    }


    // afficher le % des application de chaque user
    @GetMapping("/statusPercentage/{userId}")
    public ResponseEntity<Map<Status, Double>> getStatusPercentageByUser(@PathVariable String userId) {
        Map<Status, Double> statusPercentage = applicationService.calculateStatusPercentageByUserId(userId);
        return new ResponseEntity<>(statusPercentage, HttpStatus.OK);

    }


}
