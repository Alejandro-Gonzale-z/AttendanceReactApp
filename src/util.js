import {useState, useEffect} from 'react';
import * as db from './api';

const useTeacherData = () => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try{
        const teacherData = await db.getTeacher("foobar12@gmail.com")
        setTeacher(teacherData[0]);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    }; 
    
    fetchTeacherData();
  }, []);

  return teacher;
};

export default useTeacherData;