import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './homepage.css';

function HomePage() {
  const history = useHistory();

  const navigateToCreateParty = () => {
    // Implement the logic for creating a party
    history.push("/createParty");
  };
  const navigateToProfile = () => {
    // Implement the logic for creating a party
    // history.push("/profile");
    history.push("/viewProfile");
  };
  const navigateToJoinParty = () => {
    // Implement the logic for creating a party
    history.push("/joinParty");
  };



  return (
    <div className="container">

      <div className="button-row">
        <button onClick={navigateToCreateParty}>Create Party</button>
        <button onClick={navigateToProfile}>Profile</button>
        <button onClick={navigateToJoinParty}>Join/View Party</button>
      </div>
    </div>
  );
}

export default HomePage;
