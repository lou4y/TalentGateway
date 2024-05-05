package com.cloudcrafters.taskservice.Dao;

import com.cloudcrafters.taskservice.Entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModuleDao extends JpaRepository<Module, Long> {
    Optional<Module> findByModuleName(String moduleName);
}