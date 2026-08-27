import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import "./ProjectDetails.css";

function ProjectDetails() {

    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingTask, setEditingTask] = useState(null);

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM"
    });

    useEffect(() => {
        fetchProjectData();
    }, [projectId]);

    const fetchProjectData = async () => {

        try {

            setError("");

            const [projectResponse, tasksResponse] =
                await Promise.all([
                    axiosInstance.get(`/api/projects/${projectId}`),
                    axiosInstance.get(`/api/projects/${projectId}/tasks`)
                ]);

            setProject(projectResponse.data);
            setTasks(tasksResponse.data);

        } catch (err) {

            console.error("Project details error:", err);

            if (err.response?.status === 404) {
                setError("Project not found.");
            } else {
                setError("Unable to load project.");
            }

        } finally {
            setLoading(false);
        }
    };

    const startEditTask = (task) => {

        setEditingTask(task);

        setEditForm({
            title: task.title,
            description: task.description || "",
            status: task.status,
            priority: task.priority
        });
    };

    const handleEditChange = (e) => {

        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateTask = async (e) => {

        e.preventDefault();

        try {

            await axiosInstance.put(
                `/api/tasks/${editingTask.id}`,
                {
                    ...editForm,
                    projectId: Number(projectId)
                }
            );

            setEditingTask(null);

            await fetchProjectData();

        } catch (err) {

            console.error("Update task error:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Unable to update task.");
            }
        }
    };

    const handleDeleteTask = async (taskId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await axiosInstance.delete(
                `/api/tasks/${taskId}`
            );

            await fetchProjectData();

        } catch (err) {

            console.error("Delete task error:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Unable to delete task.");
            }
        }
    };

    if (loading) {
        return (
            <div className="project-details-loading">
                Loading project...
            </div>
        );
    }

    return (
        <div className="project-details-page">

            <Sidebar />

            <main className="project-details-main">

                <button
                    className="back-button"
                    onClick={() => navigate("/projects")}
                >
                    ← Back to projects
                </button>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {!project ? (

                    <div className="project-error">

                        <h2>
                            {error || "Unable to load project"}
                        </h2>

                        <button
                            onClick={() => navigate("/projects")}
                        >
                            Return to Projects
                        </button>

                    </div>

                ) : (

                    <>
                        <div className="project-details-header">

                            <div>

                                <p className="project-label">
                                    PROJECT #{project.id}
                                </p>

                                <h1>
                                    {project.name}
                                </h1>

                                <p className="project-description-text">
                                    {project.description ||
                                        "No description provided."}
                                </p>

                            </div>

                            <button
                                className="add-task-button"
                                onClick={() =>
                                    navigate(
                                        `/projects/${projectId}/tasks/new`
                                    )
                                }
                            >
                                + Add Task
                            </button>

                        </div>

                        <div className="project-summary">

                            <div>

                                <span>Total Tasks</span>

                                <strong>
                                    {tasks.length}
                                </strong>

                            </div>

                            <div>

                                <span>To Do</span>

                                <strong>
                                    {
                                        tasks.filter(
                                            task =>
                                                task.status === "TODO"
                                        ).length
                                    }
                                </strong>

                            </div>

                            <div>

                                <span>In Progress</span>

                                <strong>
                                    {
                                        tasks.filter(
                                            task =>
                                                task.status === "IN_PROGRESS"
                                        ).length
                                    }
                                </strong>

                            </div>

                            <div>

                                <span>Completed</span>

                                <strong>
                                    {
                                        tasks.filter(
                                            task =>
                                                task.status === "COMPLETED"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>

                        <section className="project-tasks-section">

                            <div className="tasks-heading">

                                <div>

                                    <h2>Tasks</h2>

                                    <p>
                                        Tasks belonging to this project.
                                    </p>

                                </div>

                            </div>

                            {tasks.length === 0 ? (

                                <div className="no-project-tasks">

                                    <h3>No tasks yet</h3>

                                    <p>
                                        Create the first task for this project.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/projects/${projectId}/tasks/new`
                                            )
                                        }
                                    >
                                        + Create Task
                                    </button>

                                </div>

                            ) : (

                                <div className="project-task-list">

                                    {tasks.map(task => (

                                        <div
                                            className="project-task-card"
                                            key={task.id}
                                        >

                                            <div className="task-information">

                                                <h3>
                                                    {task.title}
                                                </h3>

                                                <p>
                                                    {task.description ||
                                                        "No description"}
                                                </p>

                                            </div>

                                            <div className="task-right-section">

                                                <div className="task-labels">

                                                    <span
                                                        className={`status-badge status-${task.status.toLowerCase()}`}
                                                    >
                                                        {task.status.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>

                                                    <span
                                                        className={`priority-badge priority-${task.priority.toLowerCase()}`}
                                                    >
                                                        {task.priority}
                                                    </span>

                                                </div>

                                                <div className="task-actions">

                                                    <button
                                                        className="edit-task-button"
                                                        onClick={() =>
                                                            startEditTask(task)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-task-button"
                                                        onClick={() =>
                                                            handleDeleteTask(task.id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </section>

                        {editingTask && (

                            <div className="task-modal-overlay">

                                <div className="task-modal">

                                    <div className="task-modal-header">

                                        <div>

                                            <p>
                                                EDIT TASK
                                            </p>

                                            <h2>
                                                {editingTask.title}
                                            </h2>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingTask(null)
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                    <form onSubmit={handleUpdateTask}>

                                        <div className="mb-3">

                                            <label className="form-label">
                                                Title
                                            </label>

                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control"
                                                value={editForm.title}
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

                                        <div className="task-edit-row">

                                            <div>

                                                <label className="form-label">
                                                    Status
                                                </label>

                                                <select
                                                    name="status"
                                                    className="form-select"
                                                    value={editForm.status}
                                                    onChange={handleEditChange}
                                                >

                                                    <option value="TODO">
                                                        To Do
                                                    </option>

                                                    <option value="IN_PROGRESS">
                                                        In Progress
                                                    </option>

                                                    <option value="COMPLETED">
                                                        Completed
                                                    </option>

                                                </select>

                                            </div>

                                            <div>

                                                <label className="form-label">
                                                    Priority
                                                </label>

                                                <select
                                                    name="priority"
                                                    className="form-select"
                                                    value={editForm.priority}
                                                    onChange={handleEditChange}
                                                >

                                                    <option value="LOW">
                                                        Low
                                                    </option>

                                                    <option value="MEDIUM">
                                                        Medium
                                                    </option>

                                                    <option value="HIGH">
                                                        High
                                                    </option>

                                                </select>

                                            </div>

                                        </div>

                                        <div className="task-modal-actions">

                                            <button
                                                type="button"
                                                className="task-modal-cancel"
                                                onClick={() =>
                                                    setEditingTask(null)
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="task-modal-save"
                                            >
                                                Save Changes
                                            </button>

                                        </div>

                                    </form>

                                </div>

                            </div>

                        )}

                    </>
                )}

            </main>

        </div>
    );
}

export default ProjectDetails;