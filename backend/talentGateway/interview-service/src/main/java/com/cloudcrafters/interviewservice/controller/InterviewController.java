
package com.cloudcrafters.interviewservice.controller;
import com.cloudcrafters.interviewservice.dto.ApplicationInterviewResponse;
import com.cloudcrafters.interviewservice.dto.InterviewRequest;
import com.cloudcrafters.interviewservice.dto.InterviewResponse;

import com.cloudcrafters.interviewservice.service.ApplicationService;
import com.cloudcrafters.interviewservice.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final ApplicationService applicationService;

    @PostMapping("/create/{applicationId}")
    @ResponseStatus(HttpStatus.CREATED)
    public InterviewResponse createInterview(@PathVariable String applicationId, @RequestBody InterviewRequest interviewRequest) {
        return interviewService.createInterview(applicationId, interviewRequest);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<InterviewResponse> getAllInterviews() {
        return interviewService.getAllInterviews();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public InterviewResponse getInterviewById(@PathVariable String id) {
        return interviewService.getInterviewById(id);
    }

    @PutMapping("/update/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateInterview(@PathVariable String id, @RequestBody InterviewRequest interviewRequest) {
        interviewService.updateInterview(id, interviewRequest);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInterview(@PathVariable String id) {
        interviewService.deleteInterview(id);
    }








}
