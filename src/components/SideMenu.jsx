import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SideMenu = ({ menuOpen, toggleMenu }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("Teacher");
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-4 transform ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform`}
    >
      <button onClick={toggleMenu} className="text-xl" />
      <nav className="mt-4">
        <Link to="/" className="py-2 flex items-center hover:bg-gray-600">
          Home
        </Link>
        <Link
          to="/classpage"
          className="py-2 flex items-center hover:bg-gray-600"
        >
          Class Page
        </Link>
        <button
          onClick={handleLogout}
          className="py-2 flex items-center hover:bg-gray-600 w-full text-left"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default SideMenu;
