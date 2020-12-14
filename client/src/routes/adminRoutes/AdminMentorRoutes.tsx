import React from "react";
import MentorPrograms from "../../components/mentorRelated/MentorPrograms";
import ProgramDashboard from "../../components/mentorRelated/ProgramDashboard";
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
        <MentorPrograms />
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
      <Route exact path="/mentor/program/:id">
        <ProgramDashboard />
      </Route>
    </Switch>
  );
}

export default AdminClassesRoutes;
