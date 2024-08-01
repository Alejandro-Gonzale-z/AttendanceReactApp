// AttendancePage.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { deleteStudent } from "../api";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Lottie from 'react-lottie';
import redX from '../lotties/redXAnimation.json';
import greenCheck from '../lotties/greenCheckAnimation.json'
import animationData from "../lotties/AttendancePage.json";

function AttendancePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { classData } = location.state || {};
  const [option, setOption] = useState("");
  const [students, setStudents] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const redXOptions = {
    loop: false,
    autoplay: false,
    animationData: redX,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const greenCheckOptions = {
    loop: false,
    autoplay: false,
    animationData: greenCheck,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const defaultoptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  if (students === undefined) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay for the fade-in effect
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com/read/students/${classData.class_id}`
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching Students:", error);
      }
    };
    if (classData.class_id) {
      fetchStudents();
    }
  }, [classData.class_id]);

  const handleOptions = (opt) => {
    setOption(opt);
  };

  if (option === "C") {
    navigate("/attendanceReport", { state: { classData: classData } });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-100 flex flex-col items-center p-4">
        <div className="flex-grow bg-gray-100 flex flex-col items-center p-4">
          <Header 
            name={classData.class_name}
            isVisible={isVisible}
          />
          {/* <CoolAnimation defaultoptions={defaultoptions} /> */}
          <Description 
            name={classData.class_name} 
            isVisible={isVisible}
          />
          <CoolAnimation 
            defaultoptions={defaultoptions} 
            isVisible={isVisible}
          />
          <Options 
            handleOptions={handleOptions}
            isVisible={isVisible}
          />
          <StudentInfo
            class_id={classData.class_id}
            students={students}
            setStudents={setStudents}
            option={option}
            isVisible={isVisible}
            redXOptions={redXOptions}
            greenCheckOptions={greenCheckOptions}
          />
          <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
          <MenuButton toggleMenu={toggleMenu} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

const Header = ({ name, isVisible }) => {
  return (
    <header className={`text-center my-4 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-3xl font-Ubuntu font-medium">Managing Class: <strong>{name}</strong></h1>
    </header>
  );
};

const CoolAnimation = ({ defaultoptions, isVisible }) => {
  return (
    <div className={`w-full max-w-7xl items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Lottie
      options={defaultoptions}
        height={95}
        width={700}
        isClickToPauseDisabled={true}
      />
    </div>
  );
};

const Description = ({ name, isVisible }) => {
  return (
    <div className={`bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-7xl my-4 font-Ubuntu items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="text-lg text-center ">Welcome to the <strong className="font-extrabold">{name}</strong> attendance page!</h3>
      <ul>
        <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-2">
          <svg className="w-10 h-10 text-gray-800 dark:text-cyan-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"/>
          </svg>
          <span>
            <ul><strong>Managing Students:</strong> </ul>
            <ul>- Click on <button disabled className="py-1 px-1 bg-cyan-600 rounded-md shadow-md text-white">Manage Students</button> to enter the menu</ul>
            <ul>- Type in the <strong>Student's first and last name</strong> and click <button disabled className="py-1 px-1 bg-green-500 rounded-md shadow-md text-white">Add Student</button> to save a student to the class</ul>
            <ul>- Click <button disabled className="py-1 px-1 bg-red-500 rounded-md shadow-md text-white">Delete</button> to delete a student from the class</ul>
          </span>
        </li>
      </ul>
      <ul>
        <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-6">
          <svg className="w-10 h-10 dark:text-orange-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"/>
          </svg>
          <span>
            <ul><strong>Taking Attendance:</strong></ul>
            <ul>- Click on  <button disabled className="py-1 px-1 bg-orange-500 rounded-md shadow-md text-white">Take Attendace</button> </ul> 
            <ul className="py-1">- Select either  <button disabled className="py-1 px-1 bg-green-500 rounded-md shadow-md text-white">Present</button>  OR  <button disabled className="py-1 px-1 bg-red-500 rounded-md shadow-md text-white">Absent</button>  if the student is present or absent</ul>
          </span>
        </li>
      </ul>
      <ul>
        <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-6">
         <svg className="w-10 h-10 text-gray-800 dark:text-indigo-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"/>
          </svg>

          <span>
            <ul><strong>Viewing the Report:</strong></ul>
            <ul>- Click on  <button disabled className="py-1 px-1 bg-indigo-600 rounded-md shadow-md text-white">View Report</button> to visit the report page and view student and class statistics </ul>
          </span>
        </li>
      </ul>
    </div>
  );
};

const Options = ({ handleOptions, isVisible }) => {
  const [manageClick, setManageClick] = useState(false);
  const [attendanceClick, setAttendanceClick] = useState(false);

  const handleManageClick = () => {
    setManageClick((prevManageClick) => {
      const newManageClick = !prevManageClick;
      if (newManageClick) {
        handleOptions("A");
      } else {
        handleOptions("E");
      }
      return newManageClick;
    });
    setAttendanceClick(false);
  };

  const handleAttendanceClick = () => {
    setAttendanceClick((prevAttendanceClick) => {
      const newAttendanceClick = !prevAttendanceClick;
      if (newAttendanceClick) {
        handleOptions("B");
      } else {
        handleOptions("D");
      }
      return newAttendanceClick;
    });
    setManageClick(false);
  };

  return (
    <div className={`bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-6xl my-4 font-Ubuntu transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-center py-4">
        <button
          className={`px-5 py-3 rounded text-white  ${
            manageClick ? "bg-cyan-700" : "bg-cyan-600 hover:bg-cyan-700 " //maybe add shadow
          }`}
          onClick={handleManageClick}
        >
          Manage Students
        </button>
        <button
          className={`px-5 py-3 rounded text-white  ${
            attendanceClick ? "bg-orange-700" : "bg-orange-500 hover:bg-orange-600"
          }`}
          onClick={handleAttendanceClick}
        >
          Take Attendance
        </button>
        <button
          className="bg-indigo-500 text-white px-5 py-3 rounded hover:bg-indigo-600"
          onClick={() => handleOptions("C")}
        >
          View Report
        </button>
      </div>
    </div>
  );
};

const PickDate = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="bg-gray-200 p-2 rounded-lg shadow-md mb-4 text-center font-Ubuntu w-full space-x-3">
      <label className="mb-2 text-lg font-extrabold inline-flex justify-center mt-1">Select Date: </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMM dd, yyyy"
        className="bg-white p-1 rounded-2xl border border-black text-center mt-1 hover:scale-105"
      />
    </div>
  );
};

const StudentInfo = ({ class_id, students, setStudents, option, isVisible, redXOptions, greenCheckOptions }) => {
  const cookies = Cookies.get("Teacher");
  const teacher = JSON.parse(cookies);
  const teacher_id = teacher.teacher_id;
  const [newStudentFirst, setNewStudentFirst] = useState("");
  const [newStudentLast, setNewStudentLast] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [presentAnimationPlaying, setPresentAnimationPlaying] = useState(Array(students.length).fill(false));
  const [absentAnimationPlaying, setAbsentAnimationPlaying] = useState(Array(students.length).fill(false));
  const [attendanceDisabled, setAttendanceDisabled] = useState(Array(students.length).fill(false));
  const redXRefs = useRef([]);
  const greenCheckRefs = useRef([]);

  let optA = null;
  let optB = null;

  if (option === "A") {
    optA = option;
  }

  if (option === "B") {
    optB = option;
  }

  const handleAddClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com/create/student",
        {
          first_name: newStudentFirst,
          last_name: newStudentLast,
          class_id: class_id,
        }
      );
      setStudents((prevStudents) => [...prevStudents, response.data[0]]);
      setNewStudentFirst("");
      setNewStudentLast("");
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  const handleDeleteClick = async (student_first, student_last, student_id) => {
    alert(`Deleting student ${student_first} ${student_last}`);
    const del = await deleteStudent(student_id);
    setStudents(
      students.filter((student) => student.student_id !== student_id)
    );
  };

  const handleAttendanceClick = async (student_id, status, index, type) => {
    try {
      const formattedDate = formatDate(selectedDate);
      console.log("student_id:", student_id);
      console.log("class_id", class_id);
      console.log("teacher_id:", teacher_id);
      console.log("Date:", formattedDate);
      const response = await axios.post(
        "https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com/create/attendance",
        {
          student_id: student_id,
          class_id: class_id,
          teacher_id: teacher_id,
          date: String(formattedDate),
          status: status,
        }
      );
      console.log(response.data[0]);

      if (type === 'present') {
        const newAnimationPlaying = presentAnimationPlaying.slice();
        newAnimationPlaying[index] = !newAnimationPlaying[index];
        setPresentAnimationPlaying(newAnimationPlaying);

        const newAttendanceDisabled = attendanceDisabled.slice();
        newAttendanceDisabled[index] = !newAttendanceDisabled[index];
        setAttendanceDisabled(newAttendanceDisabled);
      } else if (type === 'absent') {
        const newAnimationPlaying = absentAnimationPlaying.slice();
        newAnimationPlaying[index] = !newAnimationPlaying[index];
        setAbsentAnimationPlaying(newAnimationPlaying);

        const newAttendanceDisabled = attendanceDisabled.slice();
        newAttendanceDisabled[index] = !newAttendanceDisabled[index];
        setAttendanceDisabled(newAttendanceDisabled);
      }
    } catch (error) {
      console.error("Error creating attendance:", error);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full">
      {optB && (
        <PickDate
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
      <div className={`bg-white p-4 rounded-lg shadow-md mb-4 text-center font-Ubuntu w-full transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">My Students</h1>
        </div>
        <ul className="space-y-3">
          {students.map((student, index) => (
            <li
              key={student.student_id}
              className="h-12 flex justify-between items-center bg-white p-2  hover:bg-gray-100 rounded shadow"
            >
              <span>
                {student.first_name} {student.last_name}
              </span>
              {optA && (
                <div>
                  <button
                    className="h-8 px-8 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() =>
                      handleDeleteClick(
                        student.first_name,
                        student.last_name,
                        student.student_id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
              {optB && (
                <div>
                  <button 
                    disabled={attendanceDisabled[index]}
                    className="h-8 mr-2 px-2 bg-green-700 text-white rounded hover:bg-green-600 inline-flex items-center"
                    onClick={() => handleAttendanceClick(student.student_id, 1, index, 'present')}
                  >
                    <Lottie
                      options={greenCheckOptions}
                      height={17}
                      width={17}
                      isClickToPauseDisabled={true}
                      isStopped={!presentAnimationPlaying[index]}
                      isPause={!presentAnimationPlaying[index]}
                      ref={(el) => greenCheckRefs.current[index] = el}
                    />
                    <span className="ml-1">Present</span>
                  </button>
                  <button 
                    disabled={attendanceDisabled[index]}
                    className="h-8 ml-2 px-2 bg-red-800 text-white rounded hover:bg-red-700 inline-flex items-center"
                    onClick={() => handleAttendanceClick(student.student_id, 0, index, 'absent')}
                  >
                    <Lottie
                      options={redXOptions}
                      height={17}
                      width={17}
                      isClickToPauseDisabled={true}
                      isStopped={!absentAnimationPlaying[index]}
                      isPause={!absentAnimationPlaying[index]}
                      ref={(el) => redXRefs.current[index] = el}
                    />
                    <span className="ml-1">Absent</span>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {optA && (
          <form className="flex justify-between mt-4" onSubmit={handleAddClick}>
            <input
              className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded mt-2 w-3/8"
              placeholder="New Student First Name"
              value={newStudentFirst}
              onChange={(e) => setNewStudentFirst(e.target.value)}
            />
            <input
              className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded mt-2 w-3/8"
              placeholder="New Student Last Name"
              value={newStudentLast}
              onChange={(e) => setNewStudentLast(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded mt-2 hover:bg-green-600"
            >
              Add Student
            </button>
          </form>
        )}
      </div>
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

export default AttendancePage;
