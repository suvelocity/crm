import React from "react";
import AddTeacher from "../../components/teacherRelated/AddTeacher";
import AllTeachers from "../../components/teacherRelated/AllTeachers";
import SingleTeacher from "../../components/teacherRelated/SingleTeacher";
import { Switch, Route } from "react-router-dom";

function AdminTeacherRoutes() {
  return (
    <Switch>
      <Route exact path="/teacher/add">
        <AddTeacher />
      </Route>
      <Route exact path="/teacher/all">
        <AllTeachers />
      </Route>
      <Route exact path="/teacher/:id">
        <SingleTeacher />
      </Route>
    </Switch>
  );
}

export default AdminTeacherRoutes;
