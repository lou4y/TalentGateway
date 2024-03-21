
package com.cloudcrafters.interviewservice.repository;
import com.cloudcrafters.interviewservice.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface Applicationrepository extends MongoRepository<Application,String> {

}
