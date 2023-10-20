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
    <div>
      <h1 className="text-4xl font-semibold mt-2 mb-0">
        <span className="text-yellow-800">🐔 Chicken</span>T <span className="text-red-500">🔥</span>
      </h1>
      <div className="container flex flex-col items-center justify-center h-screen p-6">

        <div className="button-row space-y-8">
          <button
            onClick={navigateToCreateParty}
            className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded w-full h-40"
          >
            Create Party
          </button>
          <button
            onClick={navigateToProfile}
            className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded w-full h-40"
          >
            Profile
          </button>
          <button
            onClick={navigateToJoinParty}
            className="bg-indigo-800 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded w-full h-40"
          >
            Join/View Party
          </button>
        </div>
      </div>
    </div>




  );
}

export default HomePage;
