// AttendancePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { deleteStudent } from "../api";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function AttendancePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { classData } = location.state;
  const [option, setOption] = useState("");
  const [students, setStudents] = useState([]);

  if (students === undefined) {
    return <p>Loading...</p>;
  }

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
    navigate("/attendanceReport", { state: { class_id: classData.class_id } });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-100 flex flex-col items-center p-4">
        <div className="mx-auto w-full max-w-4xl md:space-x-4">
          <Header name={classData.class_name} />
          <Description />
          <Options handleOptions={handleOptions} />
          <StudentInfo
            class_id={classData.class_id}
            students={students}
            setStudents={setStudents}
            option={option}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

const Header = ({ name }) => {
  return (
    <header className="text-center my-4">
      <h1 className="text-3xl font-bold">{name}</h1>
    </header>
  );
};

const Description = () => (
  <div className="bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-4xl text-center md:text-left my-4">
    <p>To add or delete students, use Manage Students.</p>
    <p>
      To take attendance, click Take Attendance. Next, select a date, and then
      mark each student as either present or absent.
    </p>
    <p>To generate an attendance report, use View Report</p>
    <p>
      Once you've finished managing students or taking attendance, click the
      button again to complete the action.
    </p>
  </div>
);

//there are three buttons therefore there are 3 options that update the studentInfo component
//these three options are passed to parent component and then passed to studentInfo component
//'A' == manage students is clicked
//'B' == take attendance is clicked
const Options = ({ handleOptions }) => {
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
    <div className="bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-4xl my-4">
      <div className="flex justify-between items-center py-4">
        <button
          className={`px-5 py-3 rounded  ${
            manageClick ? "bg-blue-500" : "bg-blue-300"
          }`}
          onClick={handleManageClick}
        >
          Manage Students
        </button>
        <button
          className={`px-5 py-3 rounded  ${
            attendanceClick ? "bg-blue-500" : "bg-blue-300"
          }`}
          onClick={handleAttendanceClick}
        >
          Take Attendance
        </button>
        <button
          className="bg-blue-300 px-5 py-3 rounded hover:bg-blue-500"
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
    <div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 text-center w-full">
      <label className="block mb-2 text-lg font-medium">Select Date</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMM dd, yyyy"
        className="bg-white p-2 rounded border"
      />
    </div>
  );
};

const StudentInfo = ({ class_id, students, setStudents, option }) => {
  const cookies = Cookies.get("Teacher");
  const teacher = JSON.parse(cookies);
  const teacher_id = teacher.teacher_id;
  const [newStudentFirst, setNewStudentFirst] = useState("");
  const [newStudentLast, setNewStudentLast] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    c;
  };

  const handleDeleteClick = async (student_first, student_last, student_id) => {
    alert(`Deleting student ${student_first} ${student_last}`);
    const del = await deleteStudent(student_id);
    setStudents(
      students.filter((student) => student.student_id !== student_id)
    );
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleAttendanceClick = async (student_id, status) => {
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
    } catch (error) {
      console.error("Error creating attendance:", error);
    }
  };

  return (
    <div className="w-full">
      {optB && (
        <PickDate
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 text-center w-full">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl">My Students</h1>
        </div>
        <ul className="space-y-3">
          {students.map((student) => (
            <li
              key={student.student_id}
              className="h-12 flex justify-between items-center bg-white p-2 rounded shadow"
            >
              <span>
                {student.first_name} {student.last_name}
              </span>
              {optA && (
                <div>
                  <button
                    className="h-8 px-8 bg-red-500 text-white rounded hover:bg-red-700"
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
                    className="h-8 mr-2 px-5 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleAttendanceClick(student.student_id, 1)}
                  >
                    Present
                  </button>
                  <button
                    className="h-8 ml-2 px-5 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => handleAttendanceClick(student.student_id, 0)}
                  >
                    Absent
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

export default AttendancePage;
