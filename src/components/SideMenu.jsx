import React from 'react';
import { Link } from 'react-router-dom';

const SideMenu = ({ menuOpen, toggleMenu }) => (
  <div
    className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-4 transform ${
      menuOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform`}
  >
    <button onClick={toggleMenu} className="text-xl">
      ×
    </button>
    <nav className="mt-4">
      <Link to="/" className="py-2 flex items-center hover:bg-gray-600">
        Home
      </Link>
      <Link to="/classpage" className="py-2 flex items-center hover:bg-gray-600">
        Class Page
      </Link>
    </nav>
  </div>
);

export default SideMenu;
