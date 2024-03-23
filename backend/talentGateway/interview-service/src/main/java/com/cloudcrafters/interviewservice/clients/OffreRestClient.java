package com.cloudcrafters.interviewservice.clients;

import com.cloudcrafters.interviewservice.entities.Offre;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "internship-service", url = "http://localhost:8888/INTERNSHIP-SERVICE")
public interface OffreRestClient {

    @GetMapping("/internships/{offreId}")
    Offre findOffreById(@PathVariable("offreId") String offreId);
}
