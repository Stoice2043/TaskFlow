import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path) => {

        if (path === "/projects") {
            return location.pathname.startsWith("/projects");
        }

        return location.pathname === path;
    };

    return (
        <aside className="sidebar">

            <div>

                {/* LOGO */}

                <div
                    className="sidebar-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    <span>TaskFlow</span>
                </div>


                {/* MENU */}

                <div className="sidebar-menu">

                    <button
                        className={
                            isActive("/dashboard")
                                ? "sidebar-menu-item active"
                                : "sidebar-menu-item"
                        }
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>


                    <button
                        className={
                            isActive("/projects")
                                ? "sidebar-menu-item active"
                                : "sidebar-menu-item"
                        }
                        onClick={() => navigate("/projects")}
                    >
                        Projects
                    </button>


                    <button
                        className={
                            isActive("/tasks")
                                ? "sidebar-menu-item active"
                                : "sidebar-menu-item"
                        }
                        onClick={() => navigate("/tasks")}
                    >
                        My Tasks
                    </button>

                </div>

            </div>


            {/* LOGOUT */}

            <div className="sidebar-bottom">

                <div className="sidebar-divider"></div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;