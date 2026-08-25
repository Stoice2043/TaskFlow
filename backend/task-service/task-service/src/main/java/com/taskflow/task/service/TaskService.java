package com.taskflow.task.service;

import com.taskflow.task.dto.TaskRequestDTO;
import com.taskflow.task.dto.TaskResponseDTO;

import java.util.List;

public interface TaskService {

    TaskResponseDTO createTask(TaskRequestDTO request, String userEmail);

    List<TaskResponseDTO> getMyTasks(String userEmail);

    TaskResponseDTO getTaskById(Long id, String userEmail);

    TaskResponseDTO updateTask(
            Long id,
            TaskRequestDTO request,
            String userEmail
    );

    void deleteTask(Long id, String userEmail);
}