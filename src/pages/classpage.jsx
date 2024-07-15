import { useState } from "react";
import SideMenu from "../components/SideMenu";

function Classpage() {
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
          <ClassInfo />
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
    <h1 className="text-3xl font-bold">Welcome, {`{connect to backend}`}!</h1>
  </header>
);

const Description = () => (
  <div className="bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-4xl text-center md:text-left my-4">
    <p>To view attendance and mark people in and out, click the class name.</p>
    <p>To add students or create/delete a class, use Manage Classes.</p>
    <p>To view attendance data, click View Report.</p>
  </div>
);

const ClassInfo = () => {
  const [classes, setClasses] = useState(["CS485", "CS350", "CS485", "CS", "CS288", "CS350", "CS415"]);
  const [manageClasses, setManageClasses] = useState(false);

  const handleManageClasses = () => {
    setManageClasses(true);
  };

  const handleMyClasses = () => {
    setManageClasses(false);
  };

  const handleDeleteClass = (className) => {
    setClasses(classes.filter((c) => c !== className));
  };

  const handleAddStudent = (className) => {
    alert(`Add student to ${className}`);
    // Implement the logic to add a student
  };

  const handleDeleteStudent = (className) => {
    alert(`Delete student from ${className}`);
    // Implement the logic to delete a student
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleMyClasses}
          className={`px-4 py-2 rounded ${manageClasses ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
        >
          My Classes
        </button>
        <button
          onClick={handleManageClasses}
          className={`px-4 py-2 rounded ${manageClasses ? 'bg-gray-300' : 'bg-green-500 text-white'}`}
        >
          Manage Classes
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded">View Report</button>
      </div>
      <ul className="space-y-2">
        {classes.map((className) => (
          <li key={className} className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded">
            <span>{className}</span>
            {manageClasses && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddStudent(className)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Add Student
                </button>
                <button
                  onClick={() => handleDeleteStudent(className)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Delete Student
                </button>
                <button
                  onClick={() => handleDeleteClass(className)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete Class
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
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

const Footer = () => (
  <footer className="w-full text-center py-4 bg-gray-800 text-white">
    <p>
      &copy; {new Date().getFullYear()} DigitalAttendanceAppTitle - Group 5. All rights reserved.
    </p>
  </footer>
);

export default Classpage;
