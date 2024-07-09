import axios from 'axios';

const baseURL = "https://fatsz9vmjf.execute-api.us-east-1.amazonaws.com";

export const getTeacher = async (email) => {
  try {
    const response = await axios.get(`${baseURL}/read/teacher/email/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

export const getClasses = async (teacher_id) => {
  try {
    const response = await axios.get(`${baseURL}/read/class/${teacher_id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};
