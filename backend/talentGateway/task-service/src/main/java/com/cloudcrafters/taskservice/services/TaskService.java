package com.cloudcrafters.taskservice.services;

import com.cloudcrafters.taskservice.Dao.TaskDao;
import com.cloudcrafters.taskservice.Entities.Task;
import com.cloudcrafters.taskservice.Enums.Statut;
import com.cloudcrafters.taskservice.dto.TaskResponse;
import com.cloudcrafters.taskservice.Enums.Priority;

import java.util.List;

public interface TaskService {
    Task createTask(Task task);
    Task updateTask(Long taskId, Task taskDetails);
    List<TaskResponse> getAllTasks();
    TaskResponse getTaskById(Long taskId);
    void deleteTask(Long taskId);
    List<TaskResponse> findTasksByPriority(Priority priority);
    List<TaskResponse> findTasksByStatus(Statut statut);
    List<TaskResponse> findTasksByUserId(String userId);

    List<TaskResponse> searchTasks(String keyword);

    List<TaskResponse> findTasksSortedByStartDate();

    long countCompletedTasksByUserId(String userId);
    long countIncompleteTasksByUserId(String userId);

}
