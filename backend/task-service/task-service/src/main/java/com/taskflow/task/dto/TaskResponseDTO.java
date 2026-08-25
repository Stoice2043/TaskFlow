package com.taskflow.task.dto;

import com.taskflow.task.entity.TaskPriority;
import com.taskflow.task.entity.TaskStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TaskResponseDTO {

    private Long id;

    private String title;

    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private String userEmail;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}