import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/api/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data);
            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* LEFT SIDE */}
            <div className="login-brand-section">
                <div className="brand-content">

                    <div className="brand-logo">
                        <span>✓</span>
                        TaskFlow
                    </div>

                    <h1>
                        Organize your work.<br />
                        Achieve more.
                    </h1>

                    <p>
                        Manage projects, organize tasks and keep track
                        of everything you're working on from one place.
                    </p>

                    <div className="feature-list">
                        <div>✓ Create and manage projects</div>
                        <div>✓ Organize tasks by priority</div>
                        <div>✓ Track task progress</div>
                        <div>✓ Secure account access</div>
                    </div>

                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="login-form-section">

                <div className="login-form-container">

                    <div className="mobile-logo">
                        <span>✓</span> TaskFlow
                    </div>

                    <p className="welcome-text">WELCOME BACK</p>

                    <h2>Sign in to your account</h2>

                    <p className="login-subtitle">
                        Enter your credentials to continue to TaskFlow.
                    </p>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label className="form-label">
                                Email address
                            </label>

                            <input
                                type="email"
                                className="form-control login-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <div className="d-flex justify-content-between">
                                <label className="form-label">
                                    Password
                                </label>

                                <span className="forgot-password">
                                    Forgot password?
                                </span>
                            </div>

                            <input
                                type="password"
                                className="form-control login-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn login-button w-100"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                    </form>

                    <p className="register-text">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="register-link"
                        >
                            Create account
                        </span>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;