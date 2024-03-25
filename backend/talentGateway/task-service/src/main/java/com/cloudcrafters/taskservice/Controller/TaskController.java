package com.cloudcrafters.taskservice.Controller;

import com.cloudcrafters.taskservice.Entities.Task;
import com.cloudcrafters.taskservice.dto.TaskResponse;
import com.cloudcrafters.taskservice.Enums.Priority;
import com.cloudcrafters.taskservice.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("Tasks")
@RequiredArgsConstructor
public class TaskController {

    @Autowired
    private final TaskService taskService;

    // Create task
    @PostMapping("/CreateTask")
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            Task newTask = taskService.createTask(task);
            return new ResponseEntity<>(newTask, HttpStatus.CREATED);
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("We can't create this task: " + ex.getMessage());
        }
    }

    // Get all tasks
    @GetMapping("/GetAllTasks")
    @ResponseStatus(HttpStatus.OK)
    public List<TaskResponse> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Get task by id
    @GetMapping("/Get-Task/{taskId}")
    public ResponseEntity<?> getTaskById(@PathVariable Long taskId) {
        try {
            TaskResponse taskResponse = taskService.getTaskById(taskId);
            return ResponseEntity.ok(taskResponse);
        } catch (RuntimeException ex) {
            // If the task is not found, return a custom error message
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Task with id " + taskId + " does not exist.");
        }
    }

    // Update task
    @PutMapping("/Update/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(taskId, taskDetails);
        return ResponseEntity.ok(updatedTask);
    }

    // Delete task
    @DeleteMapping("/DeleteTask/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        try {
            taskService.deleteTask(taskId);
            return ResponseEntity.ok("Task deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get tasks by priority
    @GetMapping("/ByPriority/{priority}")
    public ResponseEntity<List<TaskResponse>> getTasksByPriority(@PathVariable Priority priority) {
        List<TaskResponse> tasks = taskService.findTasksByPriority(priority);
        if (tasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by user id
    @GetMapping("/ByUserId/{userId}")
    public ResponseEntity<List<TaskResponse>> getTasksByUserId(@PathVariable String userId) {
        List<TaskResponse> tasks = taskService.findTasksByUserId(userId);
        if (tasks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        return ResponseEntity.ok(tasks);
    }

}