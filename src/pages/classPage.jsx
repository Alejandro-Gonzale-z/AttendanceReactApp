import { useState } from "react";
import SideMenu from "../components/SideMenu";
import Cookies from "js-cookie";
import { useClassData } from "../util";
import axios from "axios";
import { deleteClass } from "../api";
import Footer from "../components/Footer";
import AttendancePage from "./attendancePage";
import { useNavigate } from "react-router-dom";

function Classespage() {
  const cookies = Cookies.get("Teacher");
  const teacher = cookies ? JSON.parse(cookies) : null;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-100 flex flex-col items-center p-4">
        <Header teacher={teacher} />
        <Description />
        <div className="flex flex-col md:flex-row md:space-x-4 my-4 w-full max-w-4xl">
          <ClassInfo teacher={teacher} />
        </div>
        <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
        <MenuButton toggleMenu={toggleMenu} />
      </main>
      <Footer />
    </div>
  );
}

const Header = ({ teacher }) => {
  let first = teacher.first_name;
  let last = teacher.last_name;
  return (
    <header className="text-center my-4">
      <h1 className="text-3xl font-bold">
        Welcome, {first} {last}!
      </h1>
    </header>
  );
};

const Description = () => (
  <div className="bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-4xl text-center md:text-left my-4">
    <p>To view attendance and mark people in and out, click the class name.</p>
    <p>To delete a class, use Manage Class.</p>
    <p>To create a class, use Create Class.</p>
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
    Cookies.set("classData", JSON.stringify(data.data));
    navigate("/attendance");
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

const ClassInfo = ({ teacher }) => {
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
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleMyClasses}
          className={`px-4 py-2 rounded ${
            manageClasses
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          My Classes
        </button>
        <button
          onClick={handleManageClasses}
          className={`px-4 py-2 rounded ${
            manageClasses
              ? "bg-gray-300 hover:bg-gray-400"
              : "bg-green-500 text-white hover:bg-green-600"
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
            className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded mt-2 w-3/4"
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
    className="fixed top-4 left-4 bg-gray-700 text-white p-2 rounded-md"
  >
    ☰
  </button>
);

export default Classespage;
