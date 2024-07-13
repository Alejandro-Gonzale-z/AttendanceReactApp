import React from 'react';
import { useTeacherData, useClassData } from '../util.js';
import Classpage from './classpage.jsx';

//a test app to see if all the custome use hooks and calls to the api work
const TestApp = () => {
  const teacher = useTeacherData("jdog@gmail.com");
  const classes = useClassData(2);
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
      <h1>Classes</h1>
      {classes.map(data => (
        <Classpage 
          key={data.class_id}
          class_id={data.class_id}
          class_name={data.class_name}
        />
      ))}
    </div>
  );
}

export default TestApp;