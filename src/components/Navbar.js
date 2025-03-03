import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/main.scss";

const Navbar = ({ token, onLogout }) => {
    const location = useLocation(); // ✅ Get current page

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
                    <Link to="/posts" className={`nav-link ${location.pathname === "/posts" ? "active" : ""}`}>Posts</Link>
                    <Link to="/projects" className="nav-link">Projects</Link>
                </div>
                <div className="nav-right">
                    {token ? (
                        <button onClick={onLogout} className="logout-btn">Logout</button>
                    ) : (
                        <Link to="/login" className="login-btn">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
