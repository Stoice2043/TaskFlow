import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import "./Projects.css";

function Projects() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const [editingProject, setEditingProject] = useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {

        try {

            const response =
                await axiosInstance.get("/api/projects");

            setProjects(response.data);

        } catch (err) {

            console.error("Failed to load projects:", err);
            setError("Unable to load projects.");

        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateProject = async (e) => {

        e.preventDefault();
        setError("");

        try {

            const response =
                await axiosInstance.post(
                    "/api/projects",
                    formData
                );

            // Add new project immediately to UI
            setProjects([
                response.data,
                ...projects
            ]);

            setFormData({
                name: "",
                description: ""
            });

            setShowForm(false);

        } catch (err) {

            console.error("Create project error:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Unable to create project.");
            }
        }
    };

    const startEditProject = (project) => {
    setEditingProject(project);

    setEditForm({
        name: project.name,
        description: project.description || ""
    });
};

const handleEditChange = (e) => {
    setEditForm({
        ...editForm,
        [e.target.name]: e.target.value
    });
};

const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
        const response = await axiosInstance.put(
            `/api/projects/${editingProject.id}`,
            editForm
        );

        setProjects(
            projects.map(project =>
                project.id === editingProject.id
                    ? response.data
                    : project
            )
        );

        setEditingProject(null);

    } catch (err) {
        console.error("Update project error:", err);

        if (err.response?.data?.message) {
            setError(err.response.data.message);
        } else {
            setError("Unable to update project.");
        }
    }
};

const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await axiosInstance.delete(
            `/api/projects/${projectId}`
        );

        setProjects(
            projects.filter(project =>
                project.id !== projectId
            )
        );

    } catch (err) {
        console.error("Delete project error:", err);

        if (err.response?.status === 409) {
            setError(
                "This project contains tasks. Delete its tasks before deleting the project."
            );
        } else if (err.response?.data?.message) {
            setError(err.response.data.message);
        } else {
            setError("Unable to delete project.");
        }
    }
};

    return (
        <div className="projects-page">

            <Sidebar />

            <main className="projects-main">

                <div className="projects-header">

                    <div>
                        <p className="projects-small-heading">
                            WORKSPACE
                        </p>

                        <h1>Projects</h1>

                        <p>
                            Create and organize your projects.
                        </p>
                    </div>

                    <button
                        className="new-project-button"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        + New Project
                    </button>

                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {showForm && (

                    <div className="project-form-card">

                        <div className="project-form-header">

                            <div>
                                <h3>Create project</h3>

                                <p>
                                    Add a new project to your workspace.
                                </p>
                            </div>

                            <button
                                className="close-form-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={handleCreateProject}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Project name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="form-control project-input"
                                    placeholder="e.g. TaskFlow Development"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    className="form-control project-description"
                                    placeholder="What is this project about?"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                />

                            </div>

                            <div className="project-form-actions">

                                <button
                                    type="button"
                                    className="cancel-project-button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="create-project-button"
                                >
                                    Create Project
                                </button>

                            </div>

                        </form>

                    </div>

                )}

                {loading ? (

                    <div className="projects-loading">
                        Loading projects...
                    </div>

                ) : projects.length === 0 ? (

                    <div className="projects-empty">

                        <div className="empty-project-icon">
                            P
                        </div>

                        <h3>No projects yet</h3>

                        <p>
                            Create your first project to start
                            organizing your tasks.
                        </p>

                        <button
                            onClick={() =>
                                setShowForm(true)
                            }
                        >
                            Create your first project
                        </button>

                    </div>

                ) : (

                    <div className="projects-grid">

                        {projects.map(project => (

                            <div
                                className="project-card"
                                key={project.id}
                                onClick={() =>
                                    navigate(
                                        `/projects/${project.id}`
                                    )
                                }
                            >

                                <div className="project-card-top">

                                    <div className="project-card-icon">
                                        {project.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <span>
                                        Project #{project.id}
                                    </span>

                                </div>

                                <h3>{project.name}</h3>

                                <p>
                                    {project.description ||
                                        "No description provided."}
                                </p>

                                <div className="project-card-footer">

                                    <span>View project</span>

                                    <div className="project-actions">

                                        <button
                                            type="button"
                                            className="project-edit-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditProject(project);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="project-delete-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProject(project.id);
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                                )}


                {/* ================= EDIT PROJECT MODAL ================= */}

                {editingProject && (

                    <div className="project-modal-overlay">

                        <div className="project-modal">

                            <div className="project-modal-header">

                                <div>
                                    <p>EDIT PROJECT</p>
                                    <h2>{editingProject.name}</h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingProject(null)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <form onSubmit={handleUpdateProject}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Project name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                    />

                                </div>


                                <div className="project-modal-actions">

                                    <button
                                        type="button"
                                        className="project-modal-cancel"
                                        onClick={() =>
                                            setEditingProject(null)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="project-modal-save"
                                    >
                                        Save Changes
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


            </main>

        </div>
    );
}

export default Projects;