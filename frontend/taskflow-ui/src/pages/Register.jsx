import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        setSuccess("");
        setLoading(true);

        try {

            const response = await axiosInstance.post(
                "/api/auth/register",
                formData
            );

            setSuccess(response.data);

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {

            console.log("FULL ERROR:", err);
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);

            if (err.response?.data?.email) {
                setError(err.response.data.email);

            } else if (err.response?.data?.password) {
                setError(err.response.data.password);

            } else if (err.response?.data?.name) {
                setError(err.response.data.name);

            } else if (typeof err.response?.data === "string") {
                setError(err.response.data);

            } else if (err.response?.data?.message) {
                setError(err.response.data.message);

            } else {
                setError("Registration failed. Please check your details.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-brand-section">

                <div className="register-brand-content">

                    <div
                        className="register-logo"
                        onClick={() => navigate("/login")}
                    >
                        <span>✓</span>
                        TaskFlow
                    </div>

                    <h1>
                        Start organizing.<br />
                        Stay in control.
                    </h1>

                    <p>
                        Create your TaskFlow account and bring your
                        projects, tasks and priorities together.
                    </p>

                    <div className="register-features">
                        <div>✓ Organize multiple projects</div>
                        <div>✓ Create and manage tasks</div>
                        <div>✓ Set task priorities</div>
                        <div>✓ Keep your workspace secure</div>
                    </div>

                </div>

            </div>

            <div className="register-form-section">

                <div className="register-form-container">

                    <p className="register-heading-small">
                        GET STARTED
                    </p>

                    <h2>Create your account</h2>

                    <p className="register-subtitle">
                        Set up your TaskFlow workspace in a few seconds.
                    </p>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">
                                Full name
                            </label>

                            <input
                                type="text"
                                name="name"
                                className="form-control register-input"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Email address
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control register-input"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="form-control register-input"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn register-button w-100"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create account"}
                        </button>

                    </form>

                    <p className="login-link-text">
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")}>
                            Sign in
                        </span>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;