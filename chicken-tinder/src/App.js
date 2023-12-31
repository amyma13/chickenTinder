import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './homepage';
import Profile from './profile';
import JoinParty from './joinParty';
import CreateParty from './createParty';
import PickRestaurants from './pickRestaurants';
import Results from './results';
import Login from './login';
import ViewProfile from './viewProfile';
import CreateAccount from './createAccount';

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/homepage" exact component={HomePage} />
        <Route path="/" exact component={Login} />
        <Route path="/createAccount" component={CreateAccount} />
        <Route path="/pickRestaurants" component={PickRestaurants} />
        <Route path="/profile" component={Profile} />
        <Route path="/viewProfile" component={ViewProfile} />
        <Route path="/joinParty" component={JoinParty} />
        <Route path="/createParty" component={CreateParty} />
        <Route path="/pickRestaurants" component={PickRestaurants} />
        <Route path="/results" component={Results} />
      </Switch>
    </Router>
  );
}

export default App;