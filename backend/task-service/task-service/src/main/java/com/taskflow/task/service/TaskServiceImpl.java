package com.taskflow.task.service;

import com.taskflow.task.dto.TaskRequestDTO;
import com.taskflow.task.dto.TaskResponseDTO;
import com.taskflow.task.entity.Task;
import com.taskflow.task.exception.TaskNotFoundException;
import com.taskflow.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public TaskResponseDTO createTask(
            TaskRequestDTO request,
            String userEmail) {

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .userEmail(userEmail)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Task savedTask = taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    @Override
    public List<TaskResponseDTO> getMyTasks(String userEmail) {

        return taskRepository.findByUserEmail(userEmail)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TaskResponseDTO getTaskById(
            Long id,
            String userEmail) {

        Task task = taskRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new TaskNotFoundException("Task not found"));

        return mapToResponse(task);
    }

    @Override
    public TaskResponseDTO updateTask(
            Long id,
            TaskRequestDTO request,
            String userEmail) {

        Task task = taskRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new TaskNotFoundException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);

        return mapToResponse(updatedTask);
    }

    @Override
    public void deleteTask(
            Long id,
            String userEmail) {

        Task task = taskRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new TaskNotFoundException("Task not found"));

        taskRepository.delete(task);
    }

    private TaskResponseDTO mapToResponse(Task task) {

        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .userEmail(task.getUserEmail())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}