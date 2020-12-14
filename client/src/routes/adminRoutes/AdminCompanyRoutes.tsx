import React from "react";
import AllCompanies from "../../components/companyRelated/AllCompanies";
import SingleCompany from "../../components/companyRelated/SingleCompany";
import AddCompany from "../../components/companyRelated/AddCompany";
import { Switch, Route } from "react-router-dom";

function AdminCompanyRoutes() {
  return (
    <Switch>
      <Route exact path="/company/add">
        <AddCompany />
      </Route>
      <Route exact path="/company/all">
        <AllCompanies />
      </Route>
      <Route exact path="/company/:id">
        <SingleCompany />
      </Route>
    </Switch>
  );
}

export default AdminCompanyRoutes;
