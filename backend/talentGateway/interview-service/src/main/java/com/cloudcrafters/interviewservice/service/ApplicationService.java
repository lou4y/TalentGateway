
    package com.cloudcrafters.interviewservice.service;

    import com.cloudcrafters.interviewservice.dto.ApplicationInterviewResponse;
    import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
    import com.cloudcrafters.interviewservice.dto.ApplicationResponse;
    import com.cloudcrafters.interviewservice.dto.InterviewResponse;
    import com.cloudcrafters.interviewservice.model.Application;
    import com.cloudcrafters.interviewservice.model.Interview;
    import com.cloudcrafters.interviewservice.repository.Applicationrepository;
    import com.cloudcrafters.interviewservice.repository.InterviewRepository;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.stereotype.Service;

    import java.util.Date;
    import java.util.List;
    import java.util.stream.Collectors;


    @Slf4j
    @Service
    @RequiredArgsConstructor
    public class ApplicationService implements IApplicationService  {

      private final Applicationrepository applicationrepository;
        private final InterviewRepository interviewRepository;

      @Override
        public void createApplication(ApplicationRequest applicationRequest){

            Application application =   Application.builder()
                    .DateofAcceptance(applicationRequest.getDateofApplication())
                    .DateofApplication(applicationRequest.getDateofAcceptance())
                    .status(applicationRequest.getStatus())
                    .offreid(applicationRequest.getOffreid())
                    .userid(applicationRequest.getUserid())
                    .build();
            applicationrepository.save(application);
            log.info("application {} is saved" , application.getId());

        }

@Override
        public List<ApplicationResponse> getALLApplication() {

           List <Application> applications =  applicationrepository.findAll();

         return    applications.stream().map(this::mapToApplicationResponse).toList();
        }

@Override
        // Mettre à jour une application
        public void updateApplication(String id, ApplicationRequest applicationRequest) {
            Application existingApplication = applicationrepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + id));

            // Mettre à jour les champs de l'application
            existingApplication.setDateofAcceptance(applicationRequest.getDateofAcceptance());
            existingApplication.setDateofApplication(applicationRequest.getDateofApplication());
            existingApplication.setStatus(applicationRequest.getStatus());
            existingApplication.setOffreid(applicationRequest.getOffreid());
            existingApplication.setUserid(applicationRequest.getUserid());
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



        ////////////affficher les interview pour chaque user /////////////////////
        @Override
        public List<ApplicationInterviewResponse> getInterviewsByUserId(String userId) {
            List<Application> applications = applicationrepository.findByUserid(userId);
            return applications.stream()
                    .map(this::mapToApplicationInterviewResponse)
                    .collect(Collectors.toList());
        }




        ////////////// Partie de mappage gérée manuellement //////////////
        private ApplicationInterviewResponse mapToApplicationInterviewResponse(Application application) {
            Interview interview = application.getInterview();
            ApplicationInterviewResponse response = new ApplicationInterviewResponse();
            response.setDateofApplication(application.getDateofApplication());
            response.setOffreid(application.getOffreid());
            response.setStatus(application.getStatus());
            if (interview != null) {
                response.setInterviewDate(interview.getInterviewDate());
                response.setInterviewDate(interview.getInterviewDate());
            }
            return response;

        }

        private ApplicationResponse mapToApplicationResponse(Application application) {
            return ApplicationResponse.builder()
                    .id(application.getId())
                    .DateofApplication(application.getDateofApplication())
                    .DateofAcceptance(application.getDateofAcceptance())
                    .status(application.getStatus())
                    .offreid(application.getOffreid())
                    .userid(application.getUserid())
                    .build();
        }
    }
