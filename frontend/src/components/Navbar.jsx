import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query.trim()}`); // Update URL
    }
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Time Capsule</h1>
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
      </ul>
    </nav>
  );
};

export default Navbar;
