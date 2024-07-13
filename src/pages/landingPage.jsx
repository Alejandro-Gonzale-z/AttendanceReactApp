import React, { useState } from "react";
import "./../index.css";
import Logo from "../components/logo1.png";
import { BiHomeAlt2 } from "react-icons/bi";
import { MdOutlineClass } from "react-icons/md";
import axios from "axios";
import { useTeacherData } from "../util";
import Cookies from "js-cookie";

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
    <h1 className="text-3xl font-bold text-">DigitalAttendanceAppTitle</h1>
  </header>
);

const Description = () => (
  <div className="flex flex-col items-center md:flex-row md:items-start space-x-0 md:space-x-4 gap-4 w-full max-w-4xl">
    <section className="flex-shrink-0">
      <img
        className="w-48 h-72 rounded-lg shadow-md outline-2 outline"
        src={Logo}
        alt="Logo"
      />
    </section>
    <section className="bg-gray-200 p-4 rounded-lg shadow-md w-full text-center md:text-left my-4">
      <p className="mb-4 font-semibold">
        Our all-in-one app provides teachers with the ultimate tool for managing
        student attendance and viewing detailed reports. <br></br> <br></br>
        Here's what you can do:
      </p>
      <ul className="list-disc list-inside">
        <li>Efficiently manage attendance for one or multiple classes.</li>
        <li>Track student presence and absences with ease.</li>
        <li>Generate and view comprehensive attendance reports.</li>
        <li>Access detailed insights on student attendance patterns.</li>
        <li>Improve classroom management.</li>
      </ul>
    </section>
  </div>
);

//replace the console.logs with like a nice on screen message
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const teacher = useTeacherData(email);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      if (teacher.email == email && teacher.password == password) {
        console.log("Successful Login");
        Cookies.set("Teacher", JSON.stringify(teacher));
      }
      if (teacher.email == email && teacher.password != password) {
        console.log("Wrong Password");
      } 
    } catch (error) {
      console.log("Account does not exist, sign-up instead!");
    }


    setEmail("");
    setPassword("");
    const TestCookies = Cookies.get('Teacher');
    if (TestCookies){
      const test = JSON.parse(TestCookies);
      console.log("COOKIES:", test.email);
    }
  };  

  return (
    <section className="bg-gray-200 p-4 rounded-lg shadow-md w-full text-center md:max-w-md my-2">
      <h2 className="text-xl font-bold mb-4" >Login</h2>
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
      const user = response.data[0];
      console.log(user);
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

const SideMenu = ({ menuOpen, toggleMenu }) => (
  <div
    className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 p-4 transform ${
      menuOpen ? "translate-x-0" : "-translate-x-full"
    } transition-transform`}
  >
    <button onClick={toggleMenu} className="text-xl">
      ×
    </button>
    <nav className="mt-4">
      <a href="#" className="py-2 flex items-center hover:bg-gray-600">
        <BiHomeAlt2 className="mr-2" />
        Home
      </a>
      <a href="#" className="py-2 flex items-center hover:bg-gray-600">
        <MdOutlineClass className="mr-2" />
        My Classes
      </a>
      <a href="#" className="block py-2 hover:bg-gray-600">
        -PlaceHolder-
      </a>
    </nav>
  </div>
);

const MenuButton = ({ toggleMenu }) => (
  <button
    onClick={toggleMenu}
    className="fixed top-4 left-4 bg-gray-700 text-white p-2 rounded-md"
  >
    ☰
  </button>
);

const Footer = () => (
  <footer className="w-full text-center py-1 bg-gray-800 text-white ">
    <p>
      &copy; {new Date().getFullYear()} DigitalAttendanceAppTitle - Group 5. All
      rights reserved.
    </p>
  </footer>
);

export default LandingPage;
