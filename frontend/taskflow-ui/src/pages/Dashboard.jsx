import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";

import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {
        fetchDashboardData();
    }, []);


    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const [projectResponse, taskResponse] =
                await Promise.all([
                    axiosInstance.get("/api/projects"),
                    axiosInstance.get("/api/tasks")
                ]);

            setProjects(projectResponse.data);
            setTasks(taskResponse.data);

        } catch (error) {

            console.error("Dashboard error:", error);

            // 401 is handled globally by axios interceptor
            if (error.response?.status !== 401) {
                setError(
                    "Unable to load dashboard data. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // STATISTICS
    // ==========================================

    const todoCount =
        tasks.filter(
            task => task.status === "TODO"
        ).length;


    const progressCount =
        tasks.filter(
            task => task.status === "IN_PROGRESS"
        ).length;


    const completedCount =
        tasks.filter(
            task => task.status === "COMPLETED"
        ).length;


    // ==========================================
    // RECENT TASKS
    // ==========================================

    const recentTasks = [...tasks]
        .sort((a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);


    // ==========================================
    // RECENT PROJECTS
    // ==========================================

    const recentProjects = [...projects]
        .sort((a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="dashboard-page">

            <Sidebar />


            <main className="dashboard-main">


                {/* ================= HEADER ================= */}

                <div className="dashboard-header">

                    <div>

                        <p className="dashboard-small-heading">
                            OVERVIEW
                        </p>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Here's what's happening with your work.
                        </p>

                    </div>

                </div>


                {/* ================= ERROR ================= */}

                {error && (

                    <div
                        className="alert alert-danger"
                        role="alert"
                    >

                        <div className="dashboard-error-content">

                            <span>
                                {error}
                            </span>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() =>
                                    setError("")
                                }
                            />

                        </div>

                    </div>

                )}


                {/* ================= STATISTICS ================= */}

                <div className="stats-grid">


                    {/* PROJECTS */}

                    <div
                        className="stat-card stat-card-clickable"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >

                        <span>
                            Total Projects
                        </span>

                        <h2>
                            {projects.length}
                        </h2>

                        <p>
                            Active workspaces
                        </p>

                    </div>


                    {/* TOTAL TASKS */}

                    <div
                        className="stat-card stat-card-clickable"
                        onClick={() =>
                            navigate("/tasks")
                        }
                    >

                        <span>
                            Total Tasks
                        </span>

                        <h2>
                            {tasks.length}
                        </h2>

                        <p>
                            Across all projects
                        </p>

                    </div>


                    {/* TODO */}

                    <div className="stat-card">

                        <span>
                            To Do
                        </span>

                        <h2>
                            {todoCount}
                        </h2>

                        <p>
                            Tasks waiting to start
                        </p>

                    </div>


                    {/* IN PROGRESS */}

                    <div className="stat-card">

                        <span>
                            In Progress
                        </span>

                        <h2>
                            {progressCount}
                        </h2>

                        <p>
                            Currently being worked on
                        </p>

                    </div>


                    {/* COMPLETED */}

                    <div className="stat-card">

                        <span>
                            Completed
                        </span>

                        <h2>
                            {completedCount}
                        </h2>

                        <p>
                            Finished tasks
                        </p>

                    </div>

                </div>


                {/* ================= MAIN CONTENT ================= */}

                <div className="dashboard-content-grid">


                    {/* ================= RECENT TASKS ================= */}

                    <section className="dashboard-panel">

                        <div className="panel-heading">

                            <div>

                                <h3>
                                    Recent Tasks
                                </h3>

                                <p>
                                    Your latest task activity
                                </p>

                            </div>


                            <button
                                className="panel-view-button"
                                onClick={() =>
                                    navigate("/tasks")
                                }
                            >
                                View all
                            </button>

                        </div>


                        {recentTasks.length === 0 ? (

                            <div className="empty-state">

                                <p>
                                    No tasks yet.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/projects")
                                    }
                                >
                                    Go to Projects
                                </button>

                            </div>

                        ) : (

                            <div className="task-list">

                                {recentTasks.map(task => (

                                    <div
                                        className="task-row"
                                        key={task.id}

                                        onClick={() =>
                                            navigate(
                                                `/projects/${task.projectId}`
                                            )
                                        }
                                    >

                                        <div className="task-row-info">

                                            <h4>
                                                {task.title}
                                            </h4>

                                            <p>
                                                {task.description ||
                                                    "No description"}
                                            </p>

                                            <span className="task-project-number">
                                                Project #{task.projectId}
                                            </span>

                                        </div>


                                        <div className="task-meta">

                                            <span
                                                className={
                                                    `status-badge status-${task.status.toLowerCase()}`
                                                }
                                            >
                                                {task.status.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>


                                            <span
                                                className={
                                                    `priority-badge priority-${task.priority.toLowerCase()}`
                                                }
                                            >
                                                {task.priority}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* ================= RECENT PROJECTS ================= */}

                    <section className="dashboard-panel">

                        <div className="panel-heading">

                            <div>

                                <h3>
                                    Recent Projects
                                </h3>

                                <p>
                                    Your latest projects
                                </p>

                            </div>


                            <button
                                className="panel-view-button"
                                onClick={() =>
                                    navigate("/projects")
                                }
                            >
                                View all
                            </button>

                        </div>


                        {recentProjects.length === 0 ? (

                            <div className="empty-state">

                                <p>
                                    No projects yet.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/projects")
                                    }
                                >
                                    Create Project
                                </button>

                            </div>

                        ) : (

                            <div className="project-list">

                                {recentProjects.map(project => (

                                    <div
                                        className="project-row"
                                        key={project.id}

                                        onClick={() =>
                                            navigate(
                                                `/projects/${project.id}`
                                            )
                                        }
                                    >

                                        <div className="project-icon">

                                            {project.name
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>


                                        <div className="project-row-info">

                                            <h4>
                                                {project.name}
                                            </h4>

                                            <p>
                                                {project.description ||
                                                    "No description"}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;