import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import "./Tasks.css";

function Tasks() {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {

        try {

            setError("");

            const response =
                await axiosInstance.get("/api/tasks");

            setTasks(response.data);

        } catch (err) {

            console.error("Failed to load tasks:", err);

            if (err.response?.status !== 401) {
                setError("Unable to load tasks.");
            }

        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = useMemo(() => {

        return tasks.filter(task => {

            const matchesStatus =
                statusFilter === "ALL" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "ALL" ||
                task.priority === priorityFilter;

            const matchesSearch =
                task.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                task.description
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            return (
                matchesStatus &&
                matchesPriority &&
                matchesSearch
            );
        });

    }, [
        tasks,
        statusFilter,
        priorityFilter,
        search
    ]);

    return (
        <div className="tasks-page">

            <Sidebar />

            <main className="tasks-main">

                <div className="tasks-header">

                    <div>

                        <p className="tasks-small-heading">
                            WORKSPACE
                        </p>

                        <h1>My Tasks</h1>

                        <p>
                            View and filter tasks across all projects.
                        </p>

                    </div>

                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="task-filters">

                    <input
                        type="text"
                        className="form-control task-search"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All Statuses
                        </option>

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

                    <select
                        className="form-select"
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All Priorities
                        </option>

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

                {loading ? (

                    <div className="tasks-loading">
                        Loading tasks...
                    </div>

                ) : filteredTasks.length === 0 ? (

                    <div className="tasks-empty">

                        <h3>No tasks found</h3>

                        <p>
                            Try changing the filters or create a task
                            inside a project.
                        </p>

                    </div>

                ) : (

                    <div className="tasks-list">

                        {filteredTasks.map(task => (

                            <div
                                className="task-card"
                                key={task.id}
                            >

                                <div className="task-card-main">

                                    <div>

                                        <h3>
                                            {task.title}
                                        </h3>

                                        <p>
                                            {task.description ||
                                                "No description"}
                                        </p>

                                    </div>

                                    <div className="task-card-badges">

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

                                </div>

                                <div className="task-card-footer">

                                    <span>
                                        Project #{task.projectId}
                                    </span>

                                    <span>
                                        Task #{task.id}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Tasks;