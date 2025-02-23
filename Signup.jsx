import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = ({ switchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [isPasswordValid, setIsPasswordValid] = useState(true); // Track password validity

  // Password validation regex
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password is valid
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters, contain 1 capital letter, 1 number, and 1 special character.");
      setIsPasswordValid(false); // Set password validity to false
      return;
    }

    // Clear error if validation passes
    setError(null);
    setIsPasswordValid(true);

    try {
      const response = await fetch("http://localhost:6969/api/auth/register", {
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

      if (response.ok) {
        // Show success message and alert
        alert("Verification email sent. Please check your inbox!");

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login"); // This will navigate to the login page
        }, 2000); // 2-second delay before redirecting
      } else {
        // Show error from backend if registration fails
        setError(data.message || "An error occurred during registration. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while connecting to the server. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                borderColor: isPasswordValid ? "" : "red", // Red border when password is invalid
              }}
            />
            {/* Show the error message only once below the password */}
            {!isPasswordValid && (
              <div style={{ color: "red" }}>
                {error}
              </div>
            )}
          </div>
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
        <p className="signup-switch-text">
          Already have an account?{" "}
          <span
            onClick={switchToLogin} // Use the function from props
            className="signup-switch-link"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
