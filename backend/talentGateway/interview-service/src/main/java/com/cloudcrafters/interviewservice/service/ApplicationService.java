
package com.cloudcrafters.interviewservice.service;
import com.cloudcrafters.interviewservice.clients.OffreRestClient;
import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
import com.cloudcrafters.interviewservice.dto.ApplicationResponse;
import com.cloudcrafters.interviewservice.dto.InterviewResponse;
import com.cloudcrafters.interviewservice.entities.Offre;
import com.cloudcrafters.interviewservice.model.Application;
import com.cloudcrafters.interviewservice.model.Interview;
import com.cloudcrafters.interviewservice.model.Status;
import com.cloudcrafters.interviewservice.repository.Applicationrepository;
import com.cloudcrafters.interviewservice.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService implements IApplicationService {

    private final Applicationrepository applicationrepository;
    private final InterviewRepository interviewRepository;
    private final OffreRestClient offreRestClient;


    @Override
    public void createApplication(ApplicationRequest applicationRequest) {


        // Vérifier s'il existe déjà une application pour cette offre et cet utilisateur
        boolean applicationExists = applicationrepository.existsByOffreidAndUserid(
                applicationRequest.getOffreid(),
                applicationRequest.getUserid()
        );
        if (applicationExists) {
            log.warn("An application for this offer and user already exists.");
            throw new IllegalStateException("An application for this offer and user already exists.");
        }
        Date currentDate = new Date();
        Application application = Application.builder()
                .dateAcceptation(applicationRequest.getDateAcceptation())
                .dateDePostulation(currentDate)
                //  .status(applicationRequest.getStatus())
                .status(applicationRequest.getStatus() != null ? applicationRequest.getStatus() : Status.PENDING)


                .offreid(applicationRequest.getOffreid())
                .userid(applicationRequest.getUserid())
                .build();
        applicationrepository.save(application);
        log.info("Application {} has been saved", application.getId());
    }


    @Override
    public List<ApplicationResponse> getALLApplication() {
        List<Application> applications = applicationrepository.findAll();
        return applications.stream()
                .map(this::mapToApplicationResponseWithInterviewDetails)
                .collect(Collectors.toList());
    }


    @Override
    // Mettre à jour une application
    public void updateApplication(String id, ApplicationRequest applicationRequest) {
        Application existingApplication = applicationrepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + id));
        // Mettre à jour les champs de l'application
        existingApplication.setDateAcceptation(applicationRequest.getDateAcceptation());
        existingApplication.setStatus(applicationRequest.getStatus());
        // Enregistrer les modifications
        applicationrepository.save(existingApplication);
        log.info("Application {} is updated", id);
    }


    // la supprision dune application doit suprimmer un interview ////////////
    @Override
    public void deleteApplication(String id) {
        // Trouver l'application à supprimer
        Application application = applicationrepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + id));

        // Récupérer l'entretien associé à cette application
        Interview interview = application.getInterview();

        // Vérifier s'il y a un entretien associé et le supprimer
        if (interview != null) {
            interviewRepository.delete(interview);
            log.info("Interview {} associated with application {} is deleted", interview.getId(), id);
        }

        // Supprimer l'application
        applicationrepository.deleteById(id);
        log.info("Application {} is deleted", id);
    }


    ////////////affficher les interview pour chaque user /////getInterviewsByUserId////////////////
    @Override
    public List<ApplicationResponse> getApplicationsByUserId(String userId) {
        List<Application> applications = applicationrepository.findByUserid(userId);
        return applications.stream()
                .map(this::mapToApplicationResponseWithInterviewDetails)
                .collect(Collectors.toList());
    }


    @Override
    public ApplicationResponse getApplicationById(String id) {
        Application application = applicationrepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + id));

        // Récupérer l'offre associée à cette application
        Offre offre = offreRestClient.findOffreById(application.getOffreid());

        // Créer une ApplicationResponse avec les détails de l'application et de l'offre
        ApplicationResponse applicationResponse = mapToApplicationResponseWithInterviewDetails(application);
        applicationResponse.setIntershipCompany(offre.getIntershipCompany());
        applicationResponse.setIntershipTitle(offre.getIntershipTitle());

        return applicationResponse;
    }


    @Override
    public List<ApplicationResponse> getApplicationsByOffreId(String offreId) {
        List<Application> applications = applicationrepository.findByOffreid(offreId);
        return applications.stream()
                .map(this::mapToApplicationResponseWithInterviewDetails)
                .collect(Collectors.toList());
    }



    @Override
    public List<ApplicationResponse> getApplicationsByStatus(Status status) {
        List<Application> applications = applicationrepository.findAllByStatus(status);

        return applications.stream()
                .map(this::mapToApplicationResponseWithInterviewDetails)
                .collect(Collectors.toList());
    }


    ////////calculer le porcentage des application
    @Override
    public Map<Status, Double> calculateStatusPercentage() {
        List<Application> applications = applicationrepository.findAll();
        int totalApplications = applications.size();
        Map<Status, Integer> statusCount = new HashMap<>();

        // Initialisation du compteur pour chaque état
        for (Status status : Status.values()) {
            statusCount.put(status, 0);
        }

        // Comptage du nombre d'applications pour chaque état
        for (Application application : applications) {
            Status status = application.getStatus();
            statusCount.put(status, statusCount.get(status) + 1);
        }

        // Calcul du pourcentage pour chaque état
        Map<Status, Double> statusPercentage = new HashMap<>();
        DecimalFormat df = new DecimalFormat("#.0"); // Définir le format pour un chiffre après la virgule
        for (Map.Entry<Status, Integer> entry : statusCount.entrySet()) {
            double percentage = (entry.getValue() * 100.0) / totalApplications;
            statusPercentage.put(entry.getKey(), Double.valueOf(df.format(percentage)));
        }

        return statusPercentage;
    }

    @Override
    public Map<Status, Double> calculateStatusPercentageByUserId(String userId) {
        List<Application> applications = applicationrepository.findByUserid(userId);
        int totalApplications = applications.size();
        Map<Status, Integer> statusCount = new HashMap<>();

        // Initialisation du compteur pour chaque état
        for (Status status : Status.values()) {
            statusCount.put(status, 0);
        }

        // Comptage du nombre d'applications pour chaque état
        for (Application application : applications) {
            Status status = application.getStatus();
            statusCount.put(status, statusCount.get(status) + 1);
        }

        // Calcul du pourcentage pour chaque état
        Map<Status, Double> statusPercentage = new HashMap<>();
        for (Map.Entry<Status, Integer> entry : statusCount.entrySet()) {
            double percentage = (entry.getValue() * 100.0) / totalApplications;
            statusPercentage.put(entry.getKey(), percentage);
        }

        return statusPercentage;
    }


    private ApplicationResponse mapToApplicationResponseWithInterviewDetails(Application application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setDateDePostulation(application.getDateDePostulation());
        response.setDateAcceptation(application.getDateAcceptation());
        response.setStatus(application.getStatus());
        response.setOffreid(application.getOffreid());
        response.setUserid(application.getUserid());

        // Récupérer l'interview associé à cette application
        Interview interview = application.getInterview();
        if (interview != null) {
            response.setInterview(mapToInterviewResponse(interview));
        }
        // Récupérer l'offre de l'application
        Offre offre = offreRestClient.findOffreById(application.getOffreid());
        response.setIntershipCompany(offre.getIntershipCompany());
        response.setIntershipTitle(offre.getIntershipTitle());

        return response;
    }

    // Méthode pour mapper un entretien à sa réponse
    private InterviewResponse mapToInterviewResponse(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());
        response.setDateEntretien(interview.getDateentretien());
        response.setModaliteEntretien(interview.getModaliteEntretien());
        return response;
    }

}
