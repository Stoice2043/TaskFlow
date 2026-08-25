package com.taskflow.task.controller;

import com.taskflow.task.dto.TaskRequestDTO;
import com.taskflow.task.dto.TaskResponseDTO;
import com.taskflow.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(
            @Valid @RequestBody TaskRequestDTO request,
            Authentication authentication) {

        String userEmail = authentication.getName();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(taskService.createTask(request, userEmail));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getMyTasks(
            Authentication authentication) {

        String userEmail = authentication.getName();

        return ResponseEntity.ok(
                taskService.getMyTasks(userEmail)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();

        return ResponseEntity.ok(
                taskService.getTaskById(id, userEmail)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO request,
            Authentication authentication) {

        String userEmail = authentication.getName();

        return ResponseEntity.ok(
                taskService.updateTask(
                        id,
                        request,
                        userEmail
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();

        taskService.deleteTask(id, userEmail);

        return ResponseEntity.noContent().build();
    }
}