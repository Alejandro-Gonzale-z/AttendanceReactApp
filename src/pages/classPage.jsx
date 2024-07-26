import React ,{ useState, useEffect } from "react";
import SideMenu from "../components/SideMenu";
import Cookies from "js-cookie";
import { useClassData } from "../util";
import axios from "axios";
import { deleteClass } from "../api";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Lottie from 'react-lottie';
import animationData from "../lotties/classPagePic.json";

function Classespage() {
  const cookies = Cookies.get("Teacher");
  const teacher = JSON.parse(cookies);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay for the fade-in effect
    return () => clearTimeout(timer);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="min-h-screen flex flex-col example-style ">
      <main className="flex-grow bg-gray-100 flex flex-col items-center p-4">
        <Header 
          teacher={teacher}
          isVisible={isVisible}
        />
        <Description 
          isVisible={isVisible} 
          defaultOptions={defaultOptions}
        />
        <div className="flex flex-col md:flex-row md:space-x-4 my-4 w-full max-w-6xl">
          <ClassInfo
            teacher={teacher}
            isVisible={isVisible}
          />
        </div>
        <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
        <MenuButton toggleMenu={toggleMenu} />
      </main>
      <Footer />
    </div>
  );
}

const Header = ({ teacher, isVisible }) => {
  let first = teacher.first_name;
  let last = teacher.last_name;
  return (
    <header className={`text-center my-4 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-3xl font-bold">
        Welcome, {first} {last}!
      </h1>
    </header>
  );
};


const Description = ({ isVisible, defaultOptions }) => (
  <div className={`flex flex-col md:flex-row md:items-start space-x-0 md:space-x-4 gap-4 w-full max-w-6xl items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
    <section className="flex-shrink-0">
      <ul className="mt-14">
        <Lottie
        options={defaultOptions}
          height={275}
          width={275}
          isClickToPauseDisabled={true}
        />
      </ul>
    </section>
    <section className="bg-gray-200 p-4 rounded-lg shadow-md w-full md:text-left my-4">
      <div>
        <h3 className="text-xl text-center font-semibold">The Class Page is your hub for managing and adding your classes! </h3>
        <br />
        <ul className="list-outside">
          <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-4">
            <svg className="w-10 h-10 text-gray-800 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
            </svg>
            <span>
              <strong>Adding a Class:</strong> click <button disabled className="py-1 px-1 bg-green-500 rounded-md shadow-md text-white">Create Class</button> and type in the  class name
            </span>
          </li>
          <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-4">
            <svg className="w-10 h-10 text-gray-800 dark:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
            <span>
              <strong>Deleting a Class:</strong> click on <button disabled className="py-1 px-1 bg-cyan-600 rounded-md shadow-md text-white">Manage Class</button> then <button disabled className=" py-1 px-1 bg-red-500 rounded-md shadow-md text-white">Delete Class</button> <strong> *[DELETES CLASS & CLASS DATA]*</strong>
            </span>
          </li>
          <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-4">
            <svg className="w-10 h-10 text-gray-800 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
            </svg>
            <span>
              <strong>Returning to Class View:</strong> click on <button disabled className="py-1 px-1 bg-gray-500 rounded-md shadow-md text-white">My Classes</button> in order to return to the origin class view
            </span>
          </li>
          <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-4">
            <svg className="w-16 h-16 text-gray-800 dark:text-cyan-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667"/>
            </svg>
            <span>
              <strong>Viewing Attendace:</strong> click on the class name to bring to single class page, there you can add students, select the date and mark them present or absent, and view the class/student attendace report
            </span>
          </li>
        </ul>
      </div>
    </section>
  </div>
);

const ClassList = ({ classData, manageClasses }) => {
  const navigate = useNavigate();

  const handleDeleteClass = async (className, class_id) => {
    alert(`Deleting class ${className}`);
    const del = await deleteClass(class_id);
    window.location.reload();
  };

  const handleClassClick = (data) => {
    navigate("/attendance", { state: { classData: data.data } });
  };

  return (
    <ul className="space-y-3">
      {classData &&
        classData.map((data) => (
          <li
            key={data.class_id}
            className="flex justify-between items-center px-4 py-4 bg-gray-100 rounded h-12 hover:bg-gray-300"
          >
            <span
              onClick={() => handleClassClick({ data })}
              style={{ cursor: "pointer" }}
            >
              {data.class_name}
            </span>
            {manageClasses && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleDeleteClass(data.class_name, data.class_id)
                  }
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                >
                  Delete Class
                </button>
              </div>
            )}
          </li>
        ))}
    </ul>
  );
};

const ClassInfo = ({ teacher, isVisible }) => {
  const teacher_id = teacher.teacher_id;
  const classData = useClassData(teacher_id);

  const [manageClasses, setManageClasses] = useState(false);
  const [addClass, setAddClass] = useState(false);
  const [newClass, setNewClass] = useState("");

  const handleManageClasses = () => {
    setManageClasses(true);
  };

  const handleMyClasses = () => {
    setManageClasses(false);
  };

  const handleAddClass = () => {
    setAddClass(!addClass);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com/create/class",
        { class_name: newClass, teacher_id: teacher_id }
      );
      setNewClass("");
      setAddClass(false);
    } catch (error) {
      console.error("Create New Class Failed", error);
    }
    window.location.reload();
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md w-full transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleMyClasses}
          className={`px-4 py-2 rounded ${
            manageClasses
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
        >
          My Classes
        </button>
        <button
          onClick={handleManageClasses}
          className={`px-4 py-2 rounded ${
            manageClasses
              ? "bg-gray-300 hover:bg-gray-400"
              : "bg-cyan-600 text-white hover:bg-cyan-700"
          }`}
        >
          Manage Class
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleAddClass}
        >
          Create Class
        </button>
      </div>
      <ClassList classData={classData} manageClasses={manageClasses} />
      {addClass && (
        <form className="flex justify-between" onSubmit={handleCreateClass}>
          <input
            className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded mt-2 w-3/4 hover:bg-gray-200"
            placeholder="New Class Name"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded mt-2 hover:bg-green-600 "
          >
            Create Class
          </button>
        </form>
      )}
    </div>
  );
};

const MenuButton = ({ toggleMenu }) => (
  <button
    onClick={toggleMenu}
    className="fixed m-1 left-4 bg-cyan-600 text-white p-2 rounded-md text-2xl"
  >
    <p className="items-center mb-1">☰</p>
  </button>
);

export default Classespage;
