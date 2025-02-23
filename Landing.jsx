import React from "react";
import "./Landing.css";
import Spline from "@splinetool/react-spline";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/Login');
  };

  return (
    <div className="container landing-page">
      <div className="grid">
        <div className="phrase_col">
          <div className="content-wrapper">
            <p className="hero-text" data-text="Digital Time Capsule">
              Digital Time Capsule
            </p>
            <div className="value-proposition">
              <p className="tagline">Preserve Today's Moments for Tomorrow's Memories</p>
              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <p>Lock memories until a special future date</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <p>Create shared capsules for group experiences</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌟</span>
                  <p>Preserve photos, videos, and stories in one secure place</p>
                </div>
              </div>
            </div>
            <div className="cta-section">
              <button className="explore-button" onClick={handleExplore}>
                <span className="button-text">Create Your Capsule</span>
                <span className="button-icon">→</span>
              </button>
              <p className="cta-subtext">Join others in preserving meaningful moments</p>
            </div>
            {/* Login and Signup Buttons */}
            <div className="auth-buttons">
              <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
              <button className="signup-btn" onClick={() => navigate("/signup")}>Signup</button>
            </div>
          </div>
        </div>
        <div className="spline_comp">
          <Spline scene="https://prod.spline.design/21ZkICmF03YHKNfn/scene.splinecode" />
        </div>
      </div>
    </div>
  );
};

export default Home;
