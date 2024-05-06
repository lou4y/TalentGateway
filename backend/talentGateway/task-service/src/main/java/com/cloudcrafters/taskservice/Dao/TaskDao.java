package com.cloudcrafters.taskservice.Dao;

import com.cloudcrafters.taskservice.Entities.Task;
import com.cloudcrafters.taskservice.Enums.Priority;
import com.cloudcrafters.taskservice.Enums.Statut;
import com.cloudcrafters.taskservice.dto.TaskResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskDao extends JpaRepository<Task, Long> {
    List<Task> findByPriority(Priority priority);
    List<Task> findByStatut(Statut statut);
    List<Task> findByUserId(String userId);
    @Query("select t from Task t where t.taskName like :kw")
    List<Task> searchTask(@Param("kw") String keyword);
    List<Task> findByOrderByStartDateAsc();
    long countByUserIdAndStatut(String userId, Statut statut);
}
