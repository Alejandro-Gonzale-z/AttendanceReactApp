// AttendancePage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AttendancePage() {
  const { className } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    console.log("Class Name:", className); // Debug log
    // Fetch students for the class
    async function fetchStudents() {
      try {
        const response = await axios.get(`/api/students?class=${className}`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }

    fetchStudents();
  }, [className]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    // Submit attendance data
    try {
      await axios.post(`/api/attendance?class=${className}&date=${selectedDate.toISOString()}`, attendance);
      alert("Attendance submitted successfully");
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <div className="attendance-page bg-gray-100 p-4 rounded-lg shadow-md max-w-4xl mx-auto">
      <header className="text-center my-4">
        <h1 className="text-3xl font-bold">Attendance for {className}</h1>
      </header>
      <div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 text-center">
        <label className="block mb-2 text-lg font-medium">Select Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMM d, yyyy"
          className="bg-white p-2 rounded border"
        />
      </div>
      <div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 text-center">
        <label className="block mb-2 text-lg font-medium">Mark student present or absent</label>
        <ul className="space-y-2">
          {students.map((student) => (
            <li key={student.id} className="flex justify-between items-center bg-white p-2 rounded shadow">
              <span>{student.name}</span>
              <div>
                <label className="mr-4">
                  <input
                    type="checkbox"
                    checked={attendance[student.id] === "present"}
                    onChange={() => handleAttendanceChange(student.id, "present")}
                  />
                  Present
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={attendance[student.id] === "absent"}
                    onChange={() => handleAttendanceChange(student.id, "absent")}
                  />
                  Absent
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Submit Attendance
      </button>
    </div>
  );
}

export default AttendancePage;
