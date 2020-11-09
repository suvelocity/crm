import React from "react";
import AddStudent from "./components/AddStudent";
import AllStudents from "./components/AllStudents";
import SingleStudent from "./components/SingleStudent";
import AddJob from "./components/jobRelated/AddJob";

function App() {
  return (
    <div>
      <AddJob />
      {/* <AllStudents /> */}
      {/* <AddStudent />
      <SingleStudent /> */}
    </div>
  );
}

export default App;
