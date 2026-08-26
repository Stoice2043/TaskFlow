package com.taskflow.task.service;

import com.taskflow.task.dto.ProjectRequestDTO;
import com.taskflow.task.dto.ProjectResponseDTO;

import java.util.List;

public interface ProjectService {

    ProjectResponseDTO createProject(
            ProjectRequestDTO request,
            String ownerEmail
    );

    List<ProjectResponseDTO> getMyProjects(String ownerEmail);

    ProjectResponseDTO getProjectById(
            Long id,
            String ownerEmail
    );

    ProjectResponseDTO updateProject(
            Long id,
            ProjectRequestDTO request,
            String ownerEmail
    );

    void deleteProject(
            Long id,
            String ownerEmail
    );
}