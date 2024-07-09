import React from 'react';
import useTeacherData from './util.js';

const Appp = () => {
  const teacher = useTeacherData();

  if (!teacher) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Teacher Info</h1>
      <p>ID: {teacher.teacher_id}</p>
      <p>First Name: {teacher.first_name}</p>
      <p>Last Name: {teacher.last_name}</p>
      <p>Email: {teacher.email}</p>
      <p>Password: {teacher.password}</p>
    </div>
  );
}

export default Appp;