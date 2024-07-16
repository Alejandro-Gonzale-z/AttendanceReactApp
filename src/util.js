import { useState, useEffect } from "react";
import * as db from "./api";

//given a teacher's email this function will return a teacher data from database
//if no teacher email is available it will return nothing
//it will rerun when teacher email is available
const useTeacherData = (email) => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (!email) {
      return;
    }

    const fetchTeacherData = async () => {
      try {
        const teacherData = await db.getTeacher(email);
        setTeacher(teacherData[0]);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherData();
  }, [email]);

  return teacher;
};

//given a teacher's id this function will return all class names a teacher has
//if no teacher id is available it will return nothing
//it will rerun when teacher email is available
const useClassData = (teacher_id) => {
  const [classes, setClasses] = useState(null);

  if (!teacher_id) {
    return;
  }

  useEffect(() => {
    const fetchClassesData = async () => {
      try {
        const classesData = await db.getClasses(teacher_id);
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching Class data:", error);
      }
    };

    fetchClassesData();
  }, [teacher_id]);

  return classes;
};

//given a class_id this function will return a list of students
//if no class_id is available on first run, it will return nothing
//it will rerun when class_id is available
const useStudentsData = (class_id) => {
  const [students, setStudents] = useState(null);

  if (!class_id) {
    return;
  }

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const studentsData = await db.getStudents(class_id);
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching Students data:", error);
      }
    };

    fetchStudentsData();
  }, [class_id]);

  return students;
};

export { useTeacherData, useClassData, useStudentsData };