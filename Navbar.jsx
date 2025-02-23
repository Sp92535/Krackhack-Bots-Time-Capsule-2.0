import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">Time Capsule</h1>
      <ul className="nav-links">
        <li className="search-bar">
          <input type="text" placeholder="Search..." />
        </li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/home">Dashboard</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
