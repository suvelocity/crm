import React from "react";
import MentorClasses from "../../components/mentorRelated/MentorClasses";
import ClassDashboard from "../../components/mentorRelated/ClassDashboard";
import NewProject from "../../components/mentorRelated/NewProject";
import NewClassMentorProject from "../../components/mentorRelated/NewClassMentorProject";
import AddMentor from "../../components/mentorRelated/AddMentor";
import SingleMentor from "../../components/mentorRelated/SingleMentor";
import AllMentors from "../../components/mentorRelated/AllMentors";
import { Switch, Route } from "react-router-dom";

function AdminClassesRoutes() {
  return (
    <Switch>
      <Route exact path="/mentor">
        <MentorClasses />
      </Route>
      <Route exact path="/mentor/all">
        <AllMentors />
      </Route>
      <Route exact path="/mentor/new">
        <NewProject />
      </Route>
      <Route exact path="/mentor/add">
        <AddMentor />
      </Route>
      <Route exact path="/mentor/:id">
        <SingleMentor />
      </Route>
      <Route exact path="/mentor/new/:id">
        <NewClassMentorProject />
      </Route>
      <Route exact path="/mentor/class/:id">
        <ClassDashboard />
      </Route>
    </Switch>
  );
}

export default AdminClassesRoutes;
