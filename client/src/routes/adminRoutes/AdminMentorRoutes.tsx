import React from "react";
import MentorPrograms from "../../components/mentorRelated/Programs/MentorPrograms";
import ProgramDashboard from "../../components/mentorRelated/Programs/ProgramDashboard";
import NewProgram from "../../components/mentorRelated/Programs/NewProgram";
import NewClassMentorProject from "../../components/mentorRelated/Programs/NewClassMentorProject";
import AddMentor from "../../components/mentorRelated/Mentors/AddMentor";
import SingleMentor from "../../components/mentorRelated/Mentors/SingleMentor";
import AllMentors from "../../components/mentorRelated/Mentors/AllMentors";
import PairMeetings from "../../components/mentorRelated/Meetings/PairMeetings";
import NavBar from "../../components/mentorRelated/NavBar";
import { Switch, Route } from "react-router-dom";

function AdminClassesRoutes() {
  return (
    <>
    <NavBar/>
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
      <Route exact path="/mentor/meeting/:id">
        <PairMeetings />
      </Route>
    </Switch>
    </>
  );
}

export default AdminClassesRoutes;
