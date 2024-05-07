package com.cloudcrafters.taskservice.servicesImp;

import com.cloudcrafters.taskservice.Mailgun.MailService;
import com.cloudcrafters.taskservice.Clients.UserRestClient;
import com.cloudcrafters.taskservice.Dao.TaskDao;
import com.cloudcrafters.taskservice.Entities.Module;
import com.cloudcrafters.taskservice.Entities.Task;
import com.cloudcrafters.taskservice.Enums.Statut;
import com.cloudcrafters.taskservice.dto.ModuleResponse;
import com.cloudcrafters.taskservice.Enums.Priority;
import com.cloudcrafters.taskservice.dto.TaskResponse;
import com.cloudcrafters.taskservice.models.User;
import com.cloudcrafters.taskservice.services.ModuleService;
import com.cloudcrafters.taskservice.services.TaskService;
import com.pusher.rest.Pusher;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private final TaskDao taskDao;

    @Resource
    private final ModuleService moduleService;

    @Autowired
    private Pusher pusher;

    @Autowired
    private UserRestClient userRestClient;

    @Autowired
    private MailService mailService;


    @Override
    public TaskResponse createTask(Task task) {
        // Fetching user based on first name and setting user details
        List<User> users = userRestClient.getAllUsers();
        Optional<User> optionalUser = userRestClient.getAllUsers().stream()
                .filter(user -> user.getFirstName().equalsIgnoreCase(task.getFirstName()))
                .findFirst();

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            task.setUser(user);  // Make sure this is part of your Task object
        } else {
            throw new RuntimeException("User not found with firstName: " + task.getFirstName());
        }


        User user = optionalUser.get();
        task.setUserId(user.getId());  // Set the user ID based on the found user
        task.setEmail(user.getEmail());  // Set the user email based on the found user

        // Module handling based on module name
        if (task.getModule() != null && task.getModule().getModuleName() != null) {
            Module module = moduleService.getModuleByName(task.getModule().getModuleName())
                    .orElseThrow(() -> new RuntimeException("Module Name does not exist or is ambiguous"));
            task.setModule(module);  // Associate the found or created module with the task
        } else {
            throw new RuntimeException("Task must have a valid module associated with it.");
        }

        // Saving the task
        Task savedTask = taskDao.save(task);

        System.out.println("Task saved with email: " + savedTask.getEmail());

        // Envoyer l'email après la sauvegarde réussie de la tâche
        try {
            mailService.sendEmail(
                    savedTask.getEmail(),
                    "New Assigned Task\n",
                    "You have been assigned a new task in the module '" + task.getModule().getModuleName() + "' with the following details:\n" +
                            "Task Name: " + savedTask.getTaskName() + "\n" +
                            "Description: " + savedTask.getTaskDescription() + "\n" +
                            "Start Date: " + savedTask.getStartDate() + "\n" +
                            "End Date: " + savedTask.getEndDate() + "\n" +
                            "Priority: " + savedTask.getPriority() + "\n" +
                            "Please login to the Platform to view more details about your Task." +
                            "\n\nRegards,\nTask Management System" +
                            "\n\nThis is an automated email. Please do not reply to this email."

            );
        } catch (Exception ignored) {

        }


        // Trigger any notifications
        if (savedTask.getModule() != null && savedTask.getModule().getProjectId() != null) {
            //  pusher.trigger("project-" + savedTask.getModule().getProjectId(), "new-task", Collections.singletonMap("message", "A new task has been created: " + savedTask.getTaskName()));
            pusher.trigger("tasks", "new-task", Collections.singletonMap("message", "A new task has been created with this Name: " + savedTask.getTaskName() + " To " + savedTask.getFirstName()+ " in " + savedTask.getModule().getModuleName() + " module"));

        } else {
            System.out.println("Project ID not available for this task");
        }
        return mapToTaskResponse(savedTask);
    }

    // Get all tasks
    @Override
    public List<TaskResponse> getAllTasks() {
        List <Task> tasks = taskDao.findAll();
        return tasks.stream().map(this::mapToTaskResponse).toList();
    }

    // Get task by ID
    @Override
    public TaskResponse getTaskById(Long taskId) {
        Task task = taskDao.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found for id: " + taskId));
        return mapToTaskResponse(task);
    }

    // Update task
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
        existingTask.setTaskDescription(taskDetails.getTaskDescription());
        existingTask.setStartDate(taskDetails.getStartDate());
        existingTask.setEndDate(taskDetails.getEndDate());
        existingTask.setDuration(taskDetails.getDuration());
        existingTask.setStatut(taskDetails.getStatut());
        existingTask.setPriority(taskDetails.getPriority());
        existingTask.setUserId(taskDetails.getUserId());
        existingTask.setFirstName(taskDetails.getFirstName());

        // Save and return the updated task
        return taskDao.save(existingTask);
    }

    // Delete task
    @Override
    public void deleteTask(Long taskId) {
        if (taskDao.existsById(taskId)) {
            taskDao.deleteById(taskId);
        } else {
            throw new RuntimeException("Task not found for id: " + taskId);
        }
    }

    // Find tasks by priority
    @Override
    public List<TaskResponse> findTasksByPriority(Priority priority) {
        List<Task> tasks = taskDao.findByPriority(priority);
        return tasks.stream().map(this::mapToTaskResponse).collect(Collectors.toList());
    }

    // Find tasks by status
    @Override
    public List<TaskResponse> findTasksByStatus(Statut statut) {
        List<Task> tasks = taskDao.findByStatut(statut);
        return tasks.stream().map(this::mapToTaskResponse).collect(Collectors.toList());
    }

    // Find tasks by user ID
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


    // Find tasks sorted by start date
    public List<TaskResponse> findTasksSortedByStartDate() {
        List<Task> tasks = taskDao.findByOrderByStartDateAsc();
        return tasks.stream().map(this::mapToTaskResponse).collect(Collectors.toList());
    }

    // Count completed tasks by user ID
    @Override
    public long countCompletedTasksByUserId(String userId) {
        return taskDao.countByUserIdAndStatut(userId, Statut.Finished);
    }

    // Count incomplete tasks by user ID
    @Override
    public long countIncompleteTasksByUserId(String userId) {
        // Combiner le compte de TO_DO et IN_PROGRESS pourrait nécessiter une approche différente
        // Ici, pour simplifier, considérons uniquement TO_DO comme exemple
        return taskDao.countByUserIdAndStatut(userId, Statut.To_do) +
                taskDao.countByUserIdAndStatut(userId, Statut.In_Progress);
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
                .taskName(task.getTaskName())
                .taskDescription(task.getTaskDescription())
                .startDate(task.getStartDate())
                .endDate(task.getEndDate())
                .duration(task.getDuration())
                .statut(task.getStatut())
                .priority(task.getPriority())
                .module(moduleResponse)
                .userId(task.getUserId())
                .firstName(task.getFirstName())
                .email(task.getEmail())
                .build();
    }

}