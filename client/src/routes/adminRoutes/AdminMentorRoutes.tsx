import React from "react";
import MentorPrograms from "../../components/mentorRelated/MentorPrograms";
import ProgramDashboard from "../../components/mentorRelated/ProgramDashboard";
import NewProgram from "../../components/mentorRelated/NewProgram";
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
        <NewProgram />
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
