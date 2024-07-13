import { useStudentsData } from "../util"

//used for the test app to see if the custom hooks created in util.js work
const Classpage = ({class_id, class_name}) => {
  const students = useStudentsData(class_id);

  if (!students) {
    return <p>Loading students...</p>;
  }

  return (
    <div>
      <h2>{class_name}</h2>
        <h3>Students</h3>
        {students.map(student => (
          <li key={student.student_id}>{student.first_name},{student.last_name}</li>
        ))}
    </div>
  )

}
export default Classpage