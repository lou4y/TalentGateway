package com.cloudcrafters.taskservice.Dao;

import com.cloudcrafters.taskservice.Entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleDao extends JpaRepository<Module, Long> {
    // This interface now extends JpaRepository, giving you CRUD operations for Module entities.
    // You can add custom queries here if needed.
}
