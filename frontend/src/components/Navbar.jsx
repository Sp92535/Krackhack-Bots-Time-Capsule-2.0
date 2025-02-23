import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query.trim()}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    alert("Logged out successfully.");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">
        TimelessTreasures 
        <img src="Time Capsule free icons designed by Freepik.jpeg" alt="Logo Icon" className="logo-img" />
      </h1>
      <ul className="nav-links">
        <li className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        </li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/home">Dashboard</Link></li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
