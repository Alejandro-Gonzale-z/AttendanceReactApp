import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Lottie from 'react-lottie';
import animationData from "../lotties/profilePic.json";

const SideMenu = ({ menuOpen, toggleMenu }) => {
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const handleLogout = () => {
    Cookies.remove("Teacher");
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-cyan-800 text-white w-64 p-4 font-Ubuntu transform ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform`}
    >
      <button onClick={toggleMenu} className="text-xl" />
      <nav className="mt-10 text-center">
        <Lottie 
        options={defaultOptions}
          height={75}
          width={75}
          isClickToPauseDisabled={true}
        />
        <Link to="/" className="py-5 flex justify-center text-xl items-center hover:bg-cyan-600 hover:rounded-xl">
          Home
        </Link>
        <Link
          to="/classList"
          className="py-5 flex justify-center items-center text-xl hover:bg-cyan-600 hover:rounded-xl"
        >
          Class Page
        </Link>
        <button
          onClick={handleLogout}
          className="py-5 flex justify-center items-center text-xl hover:bg-cyan-600 hover:rounded-xl w-full text-left"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default SideMenu;
