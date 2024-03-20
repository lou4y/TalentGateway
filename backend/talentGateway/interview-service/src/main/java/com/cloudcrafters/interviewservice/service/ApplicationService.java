
    package com.cloudcrafters.interviewservice.service;

    import com.cloudcrafters.interviewservice.dto.ApplicationRequest;
    import com.cloudcrafters.interviewservice.dto.ApplicationResponse;
    import com.cloudcrafters.interviewservice.model.Application;
    import com.cloudcrafters.interviewservice.repository.Applicationrepository;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.stereotype.Service;
    import java.util.List;


    @Slf4j
    @Service
    @RequiredArgsConstructor
    public class ApplicationService implements IApplicationService  {

      private final Applicationrepository applicationrepository;

      @Override
        public void createApplication(ApplicationRequest applicationRequest){

            Application application =   Application.builder()
                    .dateAcceptation(applicationRequest.getDateAcceptation())
                    .dateDePostulation(applicationRequest.getDateDePostulation())
                    .status(applicationRequest.getStatus())
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
            existingApplication.setDateAcceptation(applicationRequest.getDateAcceptation());
            existingApplication.setDateDePostulation(applicationRequest.getDateDePostulation());
            existingApplication.setStatus(applicationRequest.getStatus());

            // Enregistrer les modifications
            applicationrepository.save(existingApplication);
            log.info("Application {} is updated", id);
        }


        @Override
        public void deleteApplication(String id) {
            applicationrepository.deleteById(id);
            log.info("Application {} is deleted", id);
        }

        private ApplicationResponse mapToApplicationResponse(Application application) {
            return ApplicationResponse.builder()
                    .id(application.getId())
                    .dateDePostulation(application.getDateDePostulation())
                    .dateAcceptation(application.getDateAcceptation())
                    .status(application.getStatus())
                    .build();
        }
    }
