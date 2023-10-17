import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './homepage';
import RestaurantList from './restaurantlist';
import Login from './login';
import Profile from './profile';
import JoinParty from './joinParty';
import CreateParty from './createParty';
import PickRestaurants from './pickRestaurants';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/homepage" exact component={HomePage} />
        <Route path="/restaurantlist" component={RestaurantList} />
        <Route path="/profile" component={Profile} />
        <Route path="/joinParty" component={JoinParty} />
        <Route path="/createParty" component={CreateParty} />
        <Route path="/pickRestaurants" component={PickRestaurants} /> 
      </Switch>
    </Router>
  );
}

export default App;