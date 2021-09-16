import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import CheckInLanding from "./containers/CheckInLanding";
import Signup from "./containers/Signup";
import SingleCheckIn from "./containers/SingleCheckIn";
import Resources from "./containers/Resources";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/checkin/new">
        <CheckInLanding />
      </AuthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/checkin/:id">
        <SingleCheckIn />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/resources">
        <Resources />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}