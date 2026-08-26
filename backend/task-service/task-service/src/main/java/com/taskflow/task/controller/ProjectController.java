package com.taskflow.task.controller;

import com.taskflow.task.dto.ProjectRequestDTO;
import com.taskflow.task.dto.ProjectResponseDTO;
import com.taskflow.task.dto.TaskResponseDTO;
import com.taskflow.task.service.ProjectService;
import com.taskflow.task.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(
            @Valid @RequestBody ProjectRequestDTO request,
            Authentication authentication) {

        String ownerEmail = authentication.getName();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        projectService.createProject(
                                request,
                                ownerEmail
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getMyProjects(
            Authentication authentication) {

        String ownerEmail = authentication.getName();

        return ResponseEntity.ok(
                projectService.getMyProjects(ownerEmail)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(
            @PathVariable Long id,
            Authentication authentication) {

        String ownerEmail = authentication.getName();

        return ResponseEntity.ok(
                projectService.getProjectById(
                        id,
                        ownerEmail
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequestDTO request,
            Authentication authentication) {

        String ownerEmail = authentication.getName();

        return ResponseEntity.ok(
                projectService.updateProject(
                        id,
                        request,
                        ownerEmail
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            Authentication authentication) {

        String ownerEmail = authentication.getName();

        projectService.deleteProject(
                id,
                ownerEmail
        );

        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<TaskResponseDTO>> getProjectTasks(
            @PathVariable Long projectId,
            Authentication authentication) {

        String userEmail = authentication.getName();

        return ResponseEntity.ok(
                taskService.getTasksByProject(
                        projectId,
                        userEmail
                )
        );
    }
}