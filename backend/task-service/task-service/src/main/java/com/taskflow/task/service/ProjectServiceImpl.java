package com.taskflow.task.service;

import com.taskflow.task.dto.ProjectRequestDTO;
import com.taskflow.task.dto.ProjectResponseDTO;
import com.taskflow.task.entity.Project;
import com.taskflow.task.exception.ProjectHasTasksException;
import com.taskflow.task.exception.ProjectNotFoundException;
import com.taskflow.task.repository.ProjectRepository;
import com.taskflow.task.repository.TaskRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Override
    public ProjectResponseDTO createProject(
            ProjectRequestDTO request,
            String ownerEmail) {

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .ownerEmail(ownerEmail)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Project savedProject = projectRepository.save(project);

        return mapToResponse(savedProject);
    }

    @Override
    public List<ProjectResponseDTO> getMyProjects(String ownerEmail) {

        return projectRepository.findByOwnerEmail(ownerEmail)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProjectResponseDTO getProjectById(
            Long id,
            String ownerEmail) {

        Project project = projectRepository
                .findByIdAndOwnerEmail(id, ownerEmail)
                .orElseThrow(() ->
                        new ProjectNotFoundException("Project not found"));

        return mapToResponse(project);
    }

    @Override
    public ProjectResponseDTO updateProject(
            Long id,
            ProjectRequestDTO request,
            String ownerEmail) {

        Project project = projectRepository
                .findByIdAndOwnerEmail(id, ownerEmail)
                .orElseThrow(() ->
                        new ProjectNotFoundException("Project not found"));

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setUpdatedAt(LocalDateTime.now());

        Project updatedProject = projectRepository.save(project);

        return mapToResponse(updatedProject);
    }

    

    private ProjectResponseDTO mapToResponse(Project project) {

        return ProjectResponseDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerEmail(project.getOwnerEmail())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
    
    @Override
    public void deleteProject(Long id, String ownerEmail) {

        Project project = projectRepository
                .findByIdAndOwnerEmail(id, ownerEmail)
                .orElseThrow(() ->
                        new ProjectNotFoundException("Project not found"));

        boolean hasTasks =
                taskRepository.existsByProjectIdAndUserEmail(
                        id,
                        ownerEmail
                );

        if (hasTasks) {
            throw new ProjectHasTasksException(
                    "Cannot delete project because it contains tasks"
            );
        }

        projectRepository.delete(project);
    }
}