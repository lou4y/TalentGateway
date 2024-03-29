package com.cloudcrafters.taskservice.servicesImp;

import com.cloudcrafters.taskservice.Dao.TaskDao;
import com.cloudcrafters.taskservice.Entities.Module;
import com.cloudcrafters.taskservice.Entities.Task;
import com.cloudcrafters.taskservice.dto.ModuleResponse;
import com.cloudcrafters.taskservice.dto.TaskResponse;
import com.cloudcrafters.taskservice.Enums.Priority;
import com.cloudcrafters.taskservice.services.ModuleService;
import com.cloudcrafters.taskservice.services.TaskService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private final TaskDao taskDao;

    @Resource
    private final ModuleService moduleService;

    @Override
    public Task createTask(Task task) {
        if (task.getModule() != null && task.getModule().getModuleId() != null) {
            // Fetch the module from the database
            Module module = moduleService.getModuleById(task.getModule().getModuleId());
            if (module == null) {
                throw new RuntimeException("Module ID does not exist");
            }
            task.setModule(module);
        } else {
            throw new RuntimeException("Task must have a valid module");
        }
        return taskDao.save(task);
    }


    @Override
    public List<TaskResponse> getAllTasks() {
        List <Task> tasks = taskDao.findAll();
        return tasks.stream().map(this::mapToTaskResponse).toList();
    }


    @Override
    public TaskResponse getTaskById(Long taskId) {
        Task task = taskDao.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found for id: " + taskId));
        return mapToTaskResponse(task);
    }

    @Override
    public Task updateTask(Long taskId, Task taskDetails) {
        Task existingTask = taskDao.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found for id: " + taskId));

        // Check if the module ID is provided in the request body
        if (taskDetails.getModule() != null && taskDetails.getModule().getModuleId() != null) {
            // Fetch the module from the database based on the provided module ID
            Module module = moduleService.getModuleById(taskDetails.getModule().getModuleId());
            if (module != null) {
                // Set the fetched module details to the task
                existingTask.setModule(module);
            } else {
                // If the module does not exist, throw an exception or handle the error as needed
                throw new RuntimeException("Module not found for id: " + taskDetails.getModule().getModuleId());
            }
        } else {
            // If the module ID is not provided in the request body, retain the existing module
            taskDetails.setModule(existingTask.getModule());
        }

        // Update other task details
        existingTask.setTaskName(taskDetails.getTaskName());
        existingTask.setStartDate(taskDetails.getStartDate());
        existingTask.setEndDate(taskDetails.getEndDate());
        existingTask.setDuration(taskDetails.getDuration());
        existingTask.setStatut(taskDetails.getStatut());
        existingTask.setPriority(taskDetails.getPriority());
        existingTask.setUserId(taskDetails.getUserId());

        // Save and return the updated task
        return taskDao.save(existingTask);
    }


    @Override
    public void deleteTask(Long taskId) {
        if (taskDao.existsById(taskId)) {
            taskDao.deleteById(taskId);
        } else {
            throw new RuntimeException("Task not found for id: " + taskId);
        }
    }

    @Override
    public List<TaskResponse> findTasksByPriority(Priority priority) {
        List<Task> tasks = taskDao.findByPriority(priority);
        return tasks.stream().map(this::mapToTaskResponse).collect(Collectors.toList());
    }

    // Test userId
    @Override
    public List<TaskResponse> findTasksByUserId(String userId) {
        List<Task> tasks = taskDao.findByUserId(userId);
        return tasks.stream().map(this::mapToTaskResponse).collect(Collectors.toList());
    }

    // Search tasks by keyword(Task name)
    @Override
    public List<TaskResponse> searchTasks(String keyword) {
        List<Task> tasks = taskDao.searchTask(keyword);
        return tasks.stream().map(this::mapToTaskResponse).collect(Collectors.toList());

    }


    //DTO
    private TaskResponse mapToTaskResponse(Task task) {
        ModuleResponse moduleResponse = null;
        if (task.getModule() != null) {
            moduleResponse = new ModuleResponse();
            moduleResponse.setId(task.getModule().getModuleId());
            moduleResponse.setModuleName(task.getModule().getModuleName());
            moduleResponse.setModuleDescription(task.getModule().getModuleDescription());
        }
        return TaskResponse.builder()
                .id(task.getId())
                .startDate(task.getStartDate())
                .taskName(task.getTaskName())
                .endDate(task.getEndDate())
                .duration(task.getDuration())
                .statut(task.getStatut())
                .priority(task.getPriority())
                .module(moduleResponse) //  sets a ModuleResponse
                .userId(task.getUserId())
                .build();
    }

}
