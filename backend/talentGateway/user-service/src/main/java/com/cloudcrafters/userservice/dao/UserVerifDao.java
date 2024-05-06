package com.cloudcrafters.userservice.dao;

import com.cloudcrafters.userservice.entity.UserVerif;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserVerifDao extends JpaRepository<UserVerif, Long> {
    public UserVerif findByUserId(String userId);
}
