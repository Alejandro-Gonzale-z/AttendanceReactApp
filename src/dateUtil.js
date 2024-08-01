import moment from "moment";

//finds the dates in which this week started ex: 07-29-2024-08-04-2024
export const getWeekStartEndDates = () => {
  const today = moment().startOf("day");
  const todayWeekday = today.isoWeekday();

  const startOfWeek = today.clone().startOf("isoWeek");
  const endOfWeek = today.clone().endOf("isoWeek");

  if (todayWeekday === 7) {
    return {
      start: startOfWeek.subtract(1, "weeks").format("YYYY-MM-DD"),
      end: endOfWeek.subtract(1, "weeks").format("YYYY-MM-DD"),
    };
  }

  return {
    start: startOfWeek.format("YYYY-MM-DD"),
    end: endOfWeek.format("YYYY-MM-DD"),
  };
};

//returns day of the week given dateString
//ex: 07-31-2024 returns Tuesday
export const getDayName = (dateString) => {
  const date = moment.utc(dateString).add(12, "hours");
  return date.format("dddd");
};

export const formatDateTitle = (dateString) => {
  const date = new Date(dateString);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  
  return `${month} ${day}`;
};

//to be used for title of bar chart component 
//for some reason the one line different between this messes up the title of the attendance list component so
//too lazy to figure out a fix for both so we do this
export const formatDateTitle2 = (dateString) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 24); // Add 12 hours to the date
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  
  return `${month} ${day}`;
};


//converts date string parameter to Y-M-D: 2024-01-01
export const formatDateYMD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};