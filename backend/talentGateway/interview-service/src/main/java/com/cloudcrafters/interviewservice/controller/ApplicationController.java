package com.cloudcrafters.interviewservice.controller;


import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
import com.cloudcrafters.interviewservice.dto.ApplicationResponse;
import com.cloudcrafters.interviewservice.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/application")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createApplication(@RequestBody ApplicationRequest applicationRequest){


        applicationService.createApplication(applicationRequest);
    }



    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ApplicationResponse> getALLApplication(){
     return applicationService.getALLApplication();

    }



    // Endpoint pour mettre à jour une application
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateApplication(@PathVariable String id, @RequestBody ApplicationRequest applicationRequest) {
        applicationService.updateApplication(id, applicationRequest);
    }

    // Endpoint pour supprimer une application
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteApplication(@PathVariable String id) {
        applicationService.deleteApplication(id);
    }




}
