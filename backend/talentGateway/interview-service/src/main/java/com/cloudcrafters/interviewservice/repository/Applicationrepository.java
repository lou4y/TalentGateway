
package com.cloudcrafters.interviewservice.repository;


import com.cloudcrafters.interviewservice.model.Application;

import com.cloudcrafters.interviewservice.model.Status;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface Applicationrepository extends MongoRepository<Application, String> {

    List<Application> findByUserid(String userId);


    boolean existsByOffreidAndUserid(String offreid, String userid);


    List<Application> findByOffreid(String offreId);

  //  List<Application> findByStatus(Status status);

    List<Application> findAllByStatus(Status status);
}
