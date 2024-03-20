package com.cloudcrafters.interviewservice.service;


import com.cloudcrafters.interviewservice.dto.InterviewResponse;
import com.cloudcrafters.interviewservice.dto.InterviewRequest;
import com.cloudcrafters.interviewservice.model.Application;
import com.cloudcrafters.interviewservice.model.Interview;

import com.cloudcrafters.interviewservice.repository.Applicationrepository;
import com.cloudcrafters.interviewservice.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.util.List;

import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class InterviewService implements InterviewServiceInterface {

    private final InterviewRepository interviewRepository;
    private final Applicationrepository applicationRepository;

    @Override
    public InterviewResponse createInterview(String applicationId, InterviewRequest interviewRequest) {
        // Vérifier si une candidature avec l'ID spécifié existe
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + applicationId));

        // Vérifier si cette candidature a déjà un entretien associé
        if (application.getInterview() != null) {
            throw new IllegalArgumentException("Application already has an interview associated with it");
        }

        // Créer un nouvel entretien
        Interview interview = new Interview();
        interview.setDateentretien(interviewRequest.getDateEntretien());
        interview.setModaliteEntretien(interviewRequest.getModaliteEntretien());
        interview.setApplication(application); // Associer l'entretien à la candidature

        Interview savedInterview = interviewRepository.save(interview);

        // Associer l'entretien à la candidature
        application.setInterview(savedInterview);
        applicationRepository.save(application);

        return mapToInterviewResponse(savedInterview);
    }

@Override
    public List<InterviewResponse> getAllInterviews() {
        List<Interview> interviews = interviewRepository.findAll();
        return interviews.stream()
                .map(this::mapToInterviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InterviewResponse getInterviewById(String id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found with id: " + id));
        return mapToInterviewResponse(interview);
    }

    @Override
    public void updateInterview(String id, InterviewRequest interviewRequest) {
        Interview existingInterview = interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found with id: " + id));

        existingInterview.setDateentretien(interviewRequest.getDateEntretien());
        existingInterview.setModaliteEntretien(interviewRequest.getModaliteEntretien());

        interviewRepository.save(existingInterview);
        log.info("Interview {} is updated", id);
    }
@Override
    public void deleteInterview(String id) {
        interviewRepository.deleteById(id);
        log.info("Interview {} is deleted", id);
    }






    private InterviewResponse mapToInterviewResponse(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());
        response.setDateEntretien(interview.getDateentretien());
        response.setModaliteEntretien(interview.getModaliteEntretien());
        // Autres champs si nécessaire
        return response;
    }
}
