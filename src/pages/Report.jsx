import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import Lottie from 'react-lottie';
import animationData from '../lotties/ReportAnimation.json';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

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
    if (class_id) {
      fetchAttendance();
    }
  }, [class_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay for the fade-in effect
    return () => clearTimeout(timer);
  }, []);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (attendanceData.length > 0) {
    const filteredAttendance = filterAttendanceDataByDate(
      attendanceData,
      weekDates.start,
      weekDates.end
    );
    console.log("filtered:", filteredAttendance);
    getChartData(filteredAttendance);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-100 flex flex-col items-center p-4">
        <div className="flex-grow bg-gray-100 flex flex-col items-center p-4">
          <Header 
            isVisible={isVisible}
          />
          <Description 
            name={classData.class_name} 
            isVisible={isVisible} 
            defaultOptions={defaultOptions}
          />
          <Options
            viewAttendance={viewAttendance}
            setViewAttendance={setViewAttendance}
            viewReport={viewReport}
            setViewReport={setViewReport}
            isVisible={isVisible}
          />
          <AttendanceList viewAttendance={viewAttendance} class_id={class_id} />
          <BarChart
            weekDates={weekDates}
            viewReport={viewReport}
            data={chartData}
          />
          <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
          <MenuButton toggleMenu={toggleMenu} />
        </div>
      </main>
      <Footer />
    </div>
  );

};

const Header = ({ isVisible}) => {
  return (
    <div className={`text-center my-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-5xl font-bold font-Ubuntu">Attendance Report Dashboard</h1>
    </div>
  );
};

const Description = ({ name, isVisible, defaultOptions }) => {
  return (
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
          <h3 className="text-3xl text-center font-semibold">Welcome to the Dashboard for,  <strong>{name}</strong> !</h3>
          <br />
          <ul className="list-outside">
            <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-4">
              <svg className="w-10 h-10 text-gray-800 dark:text-orange-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
              </svg>
              <span>
                <strong>Viewing Individual Student Attendance:</strong>
                <li>
                  - click <button disabled className="py-1 px-1 bg-orange-500 rounded-md shadow-md text-white">View Attendance</button> and select the date to view the submitted class attendace for the day for each individual student
                </li>             
              </span>
            </li>
            <li className="flex items-center space-x-3 rtl:space-x-reverse py-1 mt-7">
              <svg className="w-10 h-10 text-gray-800 dark:text-indigo-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clip-rule="evenodd"/>
              </svg>
              <span>
                <strong>Weekly Attendance Report:</strong>
                <li className="mt-2 mb-10">
                  - click on <button disabled className="py-1 px-1 bg-indigo-600 rounded-md shadow-md text-white">View Report</button> to see your weekly class report based on the date selected in <button disabled className="py-1 px-1 bg-orange-500 rounded-md shadow-md text-white">View Attendance</button>
                </li>
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

const Options = ({
  viewAttendance,
  setViewAttendance,
  viewReport,
  setViewReport,
  isVisible
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
    <div className={`flex bg-gray-200 p-4 rounded-lg shadow-lg w-full max-w-sm my-4 justify-between transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <button
        className="px-5 py-3 rounded text-white shadow-lg bg-orange-500 hover:bg-orange-600"
        onClick={handleViewAttendanceClick}
      >
        View Attendance
      </button>
      <button
        className="px-10 py-3 rounded shadow-lg text-white bg-indigo-600 hover:bg-indigo-700"
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
      className="bg-gray-200 rounded-lg shadow-md mb-4 p-4 space-x-3 text-center font-Ubuntu max-w-6xl w-full"
      onClick={handleDatePickerClick}
    >
      <label className="mb-2 text-lg font-extrabold inline-flex justify-center mt-1">Select Date: </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMM dd, yyyy"
        className="bg-white p-1 rounded-2xl border border-black text-center font-semibold mt-1 hover:scale-105"
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
            <div className="flex flex-col w-full bg-gray-200 p-2 rounded-lg shadow-md mb-4 text-center font-semibold font-Ubuntu space-x-3 my-4">
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
                    <button disabled
                      className={`rounded px-4 py-2 ${
                        entry.status === 1 ? "bg-green-500" : "bg-red-500"
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
              <div className="text-center mt-14 font-bold text-3xl">
                <p>*No records found on {formattedDateTitle}*</p>
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
    labels: data.map((item) => item.day),
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
    <div className="max-w-6xl my-4">
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

const MenuButton = ({ toggleMenu }) => (
  <button
    onClick={toggleMenu}
    className="fixed m-1 left-4 bg-cyan-600 text-white p-2 rounded-md text-2xl"
  >
    <p className="items-center mb-1">☰</p>
  </button>
);

export default AttendanceReport;
