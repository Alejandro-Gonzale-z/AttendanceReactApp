import React, { useState } from "react";
import "./../index.css";
import Logo from "../components/logo1.png";
import axios from "axios";
import { useTeacherData } from "../util";
import Cookies from "js-cookie";
import SideMenu from "../components/SideMenu";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-100 flex flex-col items-center p-4">
        <Header />
        <Description />
        <div className="flex flex-col md:flex-row md:space-x-4 my-4 w-full max-w-4xl">
          <LoginForm />
          <SignUpForm />
        </div>
        <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
        <MenuButton toggleMenu={toggleMenu} />
      </main>
      <Footer />
    </div>
  );
}

const Header = () => (
  <header className="text-center my-4">
    <h1 className="text-3xl font-bold">DigitalAttendanceAppTitle</h1>
  </header>
);

const Description = () => (
  <div className="flex flex-col items-center md:flex-row md:items-start space-x-0 md:space-x-4 gap-4 w-full max-w-4xl">
    <section className="flex-shrink-0">
      <img className="w-48 h-72 rounded-lg shadow-md outline-2 outline mt-7" src={Logo} alt="Logo" />
    </section>
    <section className="bg-gray-200 p-4 rounded-lg shadow-md w-full text-center md:text-left my-4">
      <p className="mb-4 font-semibold">
        Our all-in-one app provides teachers with the ultimate tool for managing student attendance and viewing detailed reports.
        <br /><br />
        Here's what you can do:
      </p>
      <ul className="list-outside">
        <li className="flex items-center space-x-3 rtl:space-x-reverse py-1">
          <svg className="w-6 h-6 text-gray-800 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
          </svg>
          <span>
            Efficiently manage attendance for one or multiple classes.
          </span>
        </li>
        <li className="flex items-center space-x-3 rtl:space-x-reverse py-1">
          <svg className="w-6 h-6 text-gray-800 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
          </svg>
          <span>Track student presence and absences with ease.</span>
        </li>
        <li className="flex items-center space-x-3 rtl:space-x-reverse py-1">
          <svg className="w-6 h-6 text-gray-800 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
          </svg>
          <span>Generate and view comprehensive attendance reports.</span>
        </li>
        <li className="flex items-center space-x-3 rtl:space-x-reverse py-1">
          <svg className="w-6 h-6 text-gray-800 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
          </svg>
          <span>Access detailed insights on student attendance patterns.</span>
        </li>
        <li className="flex items-center space-x-3 rtl:space-x-reverse py-1">
          <svg className="w-6 h-6 text-gray-800 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
          </svg>
          <span>Improve classroom management.</span>
        </li>
      </ul>
    </section>
  </div>
);

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Added error message state
  const teacher = useTeacherData(email);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (teacher && teacher.email === email && teacher.password === password) {
        console.log("Successful Login");
        Cookies.set("Teacher", JSON.stringify(teacher));
        navigate("/classList");
        setErrorMessage(''); // Clear any error messages
      } else {
        setErrorMessage("Invalid email or password."); // General error message
      }
    } catch (error) {
      console.error("Login failed: ", error);
      setErrorMessage("Login failed. Please try again!"); // Set error message for exceptions
    }
  };

  return (
    <section className="bg-gray-200 p-4 rounded-lg shadow-md w-full text-center md:max-w-md my-2">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email..."
          className="p-2 rounded border"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password..."
          className="p-2 rounded border"
        />
        <button
          type="submit"
          className="bg-gray-700 text-white py-2 rounded hover:bg-gray-500"
        >
          Sign in
        </button>
      </form>
    </section>
  );
};

const SignUpForm = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com/create/teacher",
        { first_name, last_name, email, password }
      );
      const user = response.data;
      console.log("Signup Successful", user);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Signup Failed", error);
    }
  };

  return (
    <section className="bg-gray-200 p-4 rounded-lg shadow-md w-full text-center md:max-w-md my-2">
      <h2 className="text-xl font-bold mb-4">Sign-Up</h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSignUp}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email..."
          className="p-2 rounded border"
        />
        <input
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
          placeholder="First Name..."
          className="p-2 rounded border"
        />
        <input
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          type="text"
          placeholder="Last Name..."
          className="p-2 rounded border"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password..."
          className="p-2 rounded border"
        />
        <button
          type="submit"
          className="bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
        >
          Create Account
        </button>
      </form>
    </section>
  );
};

const MenuButton = ({ toggleMenu }) => (
  <button
    onClick={toggleMenu}
    className="fixed top-4 left-4 bg-gray-700 text-white p-2 rounded-md"
  >
    ☰
  </button>
);

export default LandingPage;
