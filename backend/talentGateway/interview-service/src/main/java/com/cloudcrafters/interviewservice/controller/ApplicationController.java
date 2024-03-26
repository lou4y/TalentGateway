package com.cloudcrafters.interviewservice.controller;


import com.cloudcrafters.interviewservice.clients.OffreRestClient;
import com.cloudcrafters.interviewservice.clients.UserRestClient;

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

        return applicationResponse;
    }


    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<ApplicationResponse> getALLApplication(@RequestParam(required = false) Status status) {
        List<ApplicationResponse> allApplications;

        if (status != null) {
            // Si un statut est spécifié, récupérer les applications filtrées par statut
            allApplications = applicationService.getApplicationsByStatus(status);
        } else {
            // Sinon, récupérer toutes les applications
            allApplications = applicationService.getALLApplication();
        }

        // Mettre à jour les champs intershipCompany et intershipTitle dans chaque applicationResponse
        for (ApplicationResponse applicationResponse : allApplications) {
            Offre offre = offreRestClient.findOffreById(applicationResponse.getOffreid());
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


    @GetMapping("/offre/{offreId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByOffreId(@PathVariable String offreId) {
        List<ApplicationResponse> applications = applicationService.getApplicationsByOffreId(offreId);

        // Pour chaque application, récupérer l'offre associée et mettre à jour les champs intershipCompany et intershipTitle
        for (ApplicationResponse applicationResponse : applications) {
            Offre offre = offreRestClient.findOffreById(applicationResponse.getOffreid());
            applicationResponse.setIntershipCompany(offre.getIntershipCompany());
            applicationResponse.setIntershipTitle(offre.getIntershipTitle());
        }

        // Retourner la liste mise à jour des applications
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }



    @GetMapping("/interviews/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<ApplicationResponse> getApplicationsByUserId(@PathVariable String userId) {
        List<ApplicationResponse> applicationResponses = applicationService.getApplicationsByUserId(userId);

        // Parcourir chaque élément de la liste et mettre à jour le champ intershipCompany
        for (ApplicationResponse applicationResponse : applicationResponses) {
            Offre offre = offreRestClient.findOffreById(applicationResponse.getOffreid());
            applicationResponse.setIntershipCompany(offre.getIntershipCompany());
            applicationResponse.setIntershipTitle(offre.getIntershipTitle());
        }

        // Retourner la liste mise à jour
        return applicationResponses;
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
