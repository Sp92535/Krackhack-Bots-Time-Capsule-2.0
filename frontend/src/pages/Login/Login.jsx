import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // Import the updated Login.css
import config from "../../config";

const Login = ({ switchToSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (error) setError(null); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)      
      const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const { token, expiryTime } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("expiryTime", expiryTime);

        toast.success("Login successful!");
        navigate("/explore"); // Redirect to home page after successful login
      } else {
        setError(data.message || "Invalid email or password");
        toast.error(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="login-switch-text">
          Don't have an account?
          <span onClick={switchToSignup} className="login-switch-link">
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;