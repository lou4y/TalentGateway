package com.cloudcrafters.interviewservice.clients;

import com.cloudcrafters.interviewservice.entities.Offre;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "internship-service", url = "http://localhost:8888/INTERNSHIP-SERVICE")
public interface OffreRestClient {
    @CircuitBreaker(name = "internship-servic", fallbackMethod = "getDefaultCreator")
    @GetMapping("/internships/{offreId}")
    Offre findOffreById(@PathVariable("offreId") String offreId);

    default Offre getDefaultCreator(String id, Exception exception) {
        Offre offre = new Offre();

        offre.setIntershipCompany("Not available");
        offre.setIntershipTitle("Not available");
        return offre;
    }
}
