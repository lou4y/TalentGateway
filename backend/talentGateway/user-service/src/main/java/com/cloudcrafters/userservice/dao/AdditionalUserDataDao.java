package com.cloudcrafters.userservice.dao;

import com.cloudcrafters.userservice.entity.AdditionalUserData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdditionalUserDataDao extends JpaRepository<AdditionalUserData, Long> {
    public AdditionalUserData findByUserId(String userId);
}
