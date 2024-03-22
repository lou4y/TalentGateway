package com.cloudcrafters.interviewservice.controller;


import com.cloudcrafters.interviewservice.dto.ApplicationInterviewResponse;
import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
import com.cloudcrafters.interviewservice.dto.ApplicationResponse;
import com.cloudcrafters.interviewservice.dto.InterviewResponse;
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

    // @PostMapping
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createApplication(@RequestBody ApplicationRequest applicationRequest) {


        applicationService.createApplication(applicationRequest);
    }


    // @GetMapping
    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<ApplicationResponse> getALLApplication() {
        return applicationService.getALLApplication();

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
        return applicationService.getInterviewsByUserId(userId);
    }


}
