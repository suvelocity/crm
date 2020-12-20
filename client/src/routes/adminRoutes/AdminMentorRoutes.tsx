import React from "react";
<<<<<<< HEAD
import MentorPrograms from "../../components/mentorRelated/MentorPrograms";
import ProgramDashboard from "../../components/mentorRelated/ProgramDashboard";
import NewProgram from "../../components/mentorRelated/NewProgram";
=======
import MentorClasses from "../../components/mentorRelated/MentorClasses";
import ClassDashboard from "../../components/mentorRelated/ClassDashboard";
import NewProject from "../../components/mentorRelated/NewProject";
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
import NewClassMentorProject from "../../components/mentorRelated/NewClassMentorProject";
import AddMentor from "../../components/mentorRelated/AddMentor";
import SingleMentor from "../../components/mentorRelated/SingleMentor";
import AllMentors from "../../components/mentorRelated/AllMentors";
<<<<<<< HEAD
import NavBar from "../../components/mentorRelated/NavBar";
=======
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
import { Switch, Route } from "react-router-dom";

function AdminClassesRoutes() {
  return (
<<<<<<< HEAD
    <>
    <NavBar/>
    <Switch>
      <Route exact path="/mentor">
        <MentorPrograms />
=======
    <Switch>
      <Route exact path="/mentor">
        <MentorClasses />
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
      </Route>
      <Route exact path="/mentor/all">
        <AllMentors />
      </Route>
      <Route exact path="/mentor/new">
<<<<<<< HEAD
        <NewProgram />
=======
        <NewProject />
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
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
<<<<<<< HEAD
      <Route exact path="/mentor/program/:id">
        <ProgramDashboard />
      </Route>
    </Switch>
    </>
=======
      <Route exact path="/mentor/class/:id">
        <ClassDashboard />
      </Route>
    </Switch>
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
  );
}

export default AdminClassesRoutes;
