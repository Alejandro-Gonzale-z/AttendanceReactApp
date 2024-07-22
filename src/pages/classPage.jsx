import { useState } from "react";
import SideMenu from "../components/SideMenu";
import Cookies from "js-cookie";
import { useClassData } from "../util";
import axios from "axios";
import { deleteClass } from "../api";
import Footer from "../components/Footer"
import { attendancePage } from "react-router-dom";

function Classpage() {
  const cookies = Cookies.get("Teacher");
  const teacher = JSON.parse(cookies);
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
    <p>To add students or delete a class, use Manage Classes.</p>
    <p>To create a class, click create class.</p>
  </div>
);

const ClassList = ({ classData, manageClasses }) => {
  const handleAddStudent = (className) => {
    alert(`Add student to ${className}`);
    // Implement the logic to add a student
  };

  const handleDeleteStudent = (className) => {
    alert(`Delete student from ${className}`);
    // Implement the logic to delete a student
  };

  const handleDeleteClass = async (className, class_id) => {
    alert(`Deleting class ${className}`);
      const del = await deleteClass(class_id);
      window.location.reload();
  };

  return (
    <ul className="space-y-2">
      {classData &&
        classData.map((data) => (
          <li
            key={data.class_id}
            className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded"
          >
            <attendancePage to={`/attendance/${data.class_name}`}>
              {data.class_name}
            </attendancePage>
            {manageClasses && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddStudent(data.class_name)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Add Student
                </button>
                <button
                  onClick={() => handleDeleteStudent(data.class_name)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Delete Student
                </button>
                <button
                  onClick={() => handleDeleteClass(data.class_name, data.class_id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
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
            manageClasses ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
        >
          My Classes
        </button>
        <button
          onClick={handleManageClasses}
          className={`px-4 py-2 rounded ${
            manageClasses ? "bg-gray-300" : "bg-green-500 text-white"
          }`}
        >
          Manage Classes
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

export default Classpage;
