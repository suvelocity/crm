import React from "react";
import AddStudent from "./components/AddStudent";
import AllStudents from "./components/AllStudents";
import SingleStudent from "./components/SingleStudent";

function App() {
  return (
    <div>
      <AddStudent />
      {/* <AllStudents /> */}
      <SingleStudent />
    </div>
  );
}

export default App;
