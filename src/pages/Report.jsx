import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Bar } from "react-chartjs-2";
import * as dateUtil from "../dateUtil";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceReport = () => {
  const location = useLocation();
  const { classData } = location.state || {};
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewAttendance, setViewAttendance] = useState(false);
  const [viewReport, setViewReport] = useState(false);
  const class_id = classData.class_id;
  const weekDates = dateUtil.getWeekStartEndDates();

  const chartData = [
    { day: "Monday", present: 0, absent: 0 },
    { day: "Tuesday", present: 0, absent: 0 },
    { day: "Wednesday", present: 0, absent: 0 },
    { day: "Thursday", present: 0, absent: 0 },
    { day: "Friday", present: 0, absent: 0 },
    { day: "Saturday", present: 0, absent: 0 },
    { day: "Sunday", present: 0, absent: 0 },
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com/read/attendance/${class_id}`
        );
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching Attendance:", error);
      }
    };
    // Only fetch data if class_id is present
    if (class_id) {
      fetchAttendance();
    }
  }, [class_id]);

  const filterAttendanceDataByDate = (attendanceData, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return attendanceData.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });
  };

  const getChartData = (attendanceData) => {
    for (const entry of attendanceData) {
      const dayName = dateUtil.getDayName(entry.date);
      for (const day of chartData) {
        if (day.day === dayName) {
          if (entry.status === 1) {
            day.present += 1;
          } else {
            day.absent += 1;
          }
        }
      }
    }
  };

  if (attendanceData.length > 0) {
    // console.log("WeekDates: ",weekDates);
    const filteredAttendance = filterAttendanceDataByDate(
      attendanceData,
      weekDates.start,
      weekDates.end
    );
    console.log("filtered:", filteredAttendance);
    getChartData(filteredAttendance);
  }

  return (
    <div className="min-h-screen flex flex-col example-style">
      <main className="flex-grow bg-gray-100 flex flex-col items-center p-4">
        <div className="max-width-6xl">
          <Header />
          <Description name={classData.class_name} />
          <Options
            viewAttendance={viewAttendance}
            setViewAttendance={setViewAttendance}
            viewReport={viewReport}
            setViewReport={setViewReport}
          />
          <AttendanceList viewAttendance={viewAttendance} class_id={class_id} />
          <BarChart
            weekDates={weekDates}
            viewReport={viewReport}
            data={chartData}
          />
        </div>
      </main>
    </div>
  );
};

const Header = () => {
  return (
    <div className="text-center my-6">
      <h1 className="text-3xl font-bold">Attendance Record Dashboard</h1>
    </div>
  );
};

const Description = ({ name }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-6xl my-6 text-center">
      <h3 className="text-2xl">
        Welcome to the <strong>{name}</strong> Attendance Record Dashboard
      </h3>
      <ul className="flex-col">
        <li>
          Teachers can press "View Attendance" to see an overview of their daily
          attendance, showing which students are present or absent each day.
        </li>
        <li>
          By pressing "View Report," teachers can access a bar chart displaying
          weekly attendance data, highlighting trends and patterns to help
          quickly analyze and address attendance issues.
        </li>
      </ul>
    </div>
  );
};

const Options = ({
  viewAttendance,
  setViewAttendance,
  viewReport,
  setViewReport,
}) => {
  const handleViewAttendanceClick = () => {
    setViewReport(false);
    setViewAttendance(!viewAttendance);
  };

  const handleViewReportClick = () => {
    setViewAttendance(false);
    setViewReport(!viewReport);
  };

  return (
    <div className="flex bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-6xl my-4 justify-between">
      <button
        className="px-5 py-3 rounded text-white bg-green-500"
        onClick={handleViewAttendanceClick}
      >
        View Attendance
      </button>
      <button
        className="px-5 py-3 rounded text-white bg-green-500"
        onClick={handleViewReportClick}
      >
        View Report
      </button>
    </div>
  );
};

const PickDate = ({ selectedDate, setSelectedDate, onClick }) => {
  const handleDatePickerClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      className="bg-gray-200 p-2 rounded-lg shadow-md mb-4 text-center font-Ubuntu max-w-6xl space-x-3"
      onClick={handleDatePickerClick}
    >
      <label className="mb-2 text-lg font-extrabold inline-flex justify-center mt-1"></label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMM dd, yyyy"
        className="bg-white p-1 rounded-2xl border border-black text-center mt-1 hover:scale-105"
      />
    </div>
  );
};

const AttendanceList = ({ viewAttendance, class_id }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState(null);
  const [dateClick, setDateClick] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const formattedDate = dateUtil.formatDateYMD(selectedDate);
        const response = await axios.get(
          `https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com/read/attendance/list/${class_id}/${formattedDate}`
        );
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching Attendance:", error);
      }
    };
    if (viewAttendance) {
      fetchAttendanceData();
    }
  }, [class_id, selectedDate]);

  const handleDateClick = () => {
    setDateClick(true);
  };

  const formattedDateTitle = dateUtil.formatDateTitle(selectedDate);

  return (
    <div className="w-full">
      {viewAttendance && (
        <div className="w-full my-6">
          <PickDate
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onClick={handleDateClick}
          />
          {attendanceData && attendanceData.length > 0 ? (
            <div className="flex flex-col w-full bg-gray-200 p-2 rounded-lg shadow-md mb-4 text-center font-Ubuntu space-x-3 my-4">
              <h3 className="text-xl mb-4">{formattedDateTitle} Attendance</h3>
              <ul>
                {attendanceData.map((entry) => (
                  <li
                    key={entry.student_id}
                    className={`flex justify-between items-center rounded py-2 px-8 mb-4 ${
                      entry.status === 1 ? "bg-green-400" : "bg-red-400"
                    }`}
                  >
                    <div>
                      {entry.first_name} {entry.last_name}
                    </div>
                    <button
                      className={`rounded px-4 py-2 ${
                        entry.status === 1 ? "bg-green-700" : "bg-red-700"
                      }`}
                    >
                      {entry.status === 1 ? "Present" : "Absent"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            dateClick && (
              <div>
                <p>No records found on {formattedDateTitle}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

const BarChart = ({ weekDates, viewReport, data }) => {
  const startDate = dateUtil.formatDateTitle2(weekDates.start);
  const endDate = dateUtil.formatDateTitle2(weekDates.end);

  const chartData = {
    labels: data.map((item) => item.day), // Extracting days for labels
    datasets: [
      {
        label: "Present",
        data: data.map((item) => item.present),
        backgroundColor: "rgba(39, 245, 54, .35)",
        borderColor: "rgba(39, 245, 54, 1)",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: data.map((item) => item.absent),
        backgroundColor: "rgba(255, 99, 132, 0.35)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-6xl">
      {viewReport && (
        <div className="outline rounded p-8">
          <h2 className="flex justify-center text-3xl my-6">
            Weekly Attendance Report ( {startDate} - {endDate} )
          </h2>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
