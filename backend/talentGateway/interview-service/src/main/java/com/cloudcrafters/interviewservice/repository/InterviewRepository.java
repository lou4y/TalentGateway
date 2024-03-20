package com.cloudcrafters.interviewservice.repository;
import com.cloudcrafters.interviewservice.model.Interview;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InterviewRepository extends MongoRepository<Interview, String> {



}