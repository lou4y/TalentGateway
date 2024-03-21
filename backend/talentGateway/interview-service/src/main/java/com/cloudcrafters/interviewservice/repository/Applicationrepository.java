
package com.cloudcrafters.interviewservice.repository;
import com.cloudcrafters.interviewservice.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface Applicationrepository extends MongoRepository<Application,String> {

    List<Application> findByUserid(String userId);


}
