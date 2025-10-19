import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">AI Travel Guide</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/itinerary">Itinerary Builder</Link></li>
        <li><Link to="/suggested">Suggested Trips</Link></li>
        <li><Link to="/signin">Sign In</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
