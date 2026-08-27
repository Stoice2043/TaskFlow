import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import "./CreateTask.css";

function CreateTask() {

    const { projectId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await axiosInstance.post(
                "/api/tasks",
                {
                    ...formData,
                    projectId: Number(projectId)
                }
            );

            navigate(`/projects/${projectId}`);

        } catch (err) {

            console.error("Create task error:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);

            } else if (err.response?.data?.title) {
                setError(err.response.data.title);

            } else {
                setError("Unable to create task.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-task-page">

            <Sidebar />

            <main className="create-task-main">

                <button
                    className="task-back-button"
                    onClick={() =>
                        navigate(`/projects/${projectId}`)
                    }
                >
                    ← Back to project
                </button>

                <div className="create-task-header">

                    <p>NEW TASK</p>

                    <h1>Create Task</h1>

                    <span>
                        Add a task to Project #{projectId}
                    </span>

                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="create-task-card">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">

                            <label className="form-label">
                                Task title
                            </label>

                            <input
                                type="text"
                                name="title"
                                className="form-control task-form-input"
                                placeholder="e.g. Build login page"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                name="description"
                                className="form-control task-form-textarea"
                                placeholder="Describe what needs to be done..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                            />

                        </div>

                        <div className="task-form-row">

                            <div>

                                <label className="form-label">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    className="form-select task-form-select"
                                    value={formData.status}
                                    onChange={handleChange}
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
                                    className="form-select task-form-select"
                                    value={formData.priority}
                                    onChange={handleChange}
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

                        <div className="task-form-actions">

                            <button
                                type="button"
                                className="task-cancel-button"
                                onClick={() =>
                                    navigate(`/projects/${projectId}`)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="task-create-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Task"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default CreateTask;