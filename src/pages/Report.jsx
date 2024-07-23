import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AttendanceReport = () => {
  const location = useLocation();
  const { class_id } = location.state;
  const [attendanceData, setAttendanceData] = useState([]);
  console.log(class_id);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com/read/attendance/${class_id}`
        );
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching Students:", error);
      }
    };
    // Only fetch data if class_id is present
    if (class_id) {
      fetchAttendance();
    }
  }, [class_id]);

  console.log(attendanceData);

  return (
    <div>
      <h1>Hello</h1>
      <p>{JSON.stringify(attendanceData, null, 2)}</p>
    </div>
  );
};

export default AttendanceReport;
