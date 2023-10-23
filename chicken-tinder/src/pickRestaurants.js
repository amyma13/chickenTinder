import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useHistory } from 'react-router-dom';
import { db, auth } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import "./pickRestaurants.css";
import { collection, doc, setDoc } from "firebase/firestore";

function PickRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState('');
  const history = useHistory();

  // Access location state
  const location = useLocation();
  const { zipcode, party } = location.state;

  const handleResponse = (index, response) => {
    const updatedResponses = [...userResponses];
    updatedResponses[index] = response;
    setUserResponses(updatedResponses);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const ref = collection(db, 'Results')
      await setDoc(doc(ref, auth.currentUser.email), {
        party: party,
        result: userResponses,
        user: auth.currentUser.email,
        zipcode: zipcode,
      });

      setSuccess('Responses submitted successfully');
    } catch (error) {
      console.log('Error:', error);
      setSuccess('Something went wrong :(');
    }

    history.push("/results", { zipcode: zipcode, party: party });
  };

  // useEffect(() => {
  //   // Make a GET request to your Express server
  //   //fetch(`https://chicken-tinder-omega.vercel.app/yelpAPI2?zipcode=${zipcode}`)
  //   fetch(`https://api.yelp.com/v3/businesses/search`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       console.log(response);
  //       return response.json();
  //     })
  //     .then((data) => {
  //       // Update the state with the fetched data
  //       setRestaurants(data);
  //       const initialResponses = Array(data.length).fill('');
  //       setUserResponses(initialResponses);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);

  useEffect(() => {
    const options = {method: 'GET', headers: {accept: 'application/json', Authorization: 'n1vgxCT7H7rPMv0Ed2EuFhCb049rxhsD08h8t1mxI7CfUry614nt5iDETm9nPKnrvujYoJV-VzisbZ6QscRN_Dh3ctLDuxZbrp_rZhlKL7HbCctZQeE2XfEWpgM3ZXYx' }};

    fetch(`https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=12&radius=1600&location=${zipcode}`, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }, []); 

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Link to="/joinParty" className="text-indigo-700 mb-4">
        Go Back
      </Link>
      <h1 className="text-4xl font-semibold mb-4">Would You Eat At These Restaurants?</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {restaurants.map((item, index) => (
          <div key={item.id} className="border rounded-lg shadow-md p-4">
            <div className="flex items-start">
              <img src={item.image} alt={item.name} className="w-1/2 h-48 object-cover rounded" />
              <div className="w-1/2 ml-4">
                <h2 className="text-2xl font-semibold mb-4">{item.name}</h2>
                <p className="text-gray-700">{`Address: ${item.address}`}</p>
                <p className="text-gray-700">{`Cuisine: ${item.categories}`}</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className={`${userResponses[index] === 'Yes'
                    ? 'w-1/2 mr-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded transition-colors'
                    : 'w-1/2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-3 rounded transition-colors'
                  }`}
                onClick={() => handleResponse(index, 'Yes')}
              >
                Yes
              </button>
              <button
                className={`${userResponses[index] === 'No'
                    ? 'w-1/2 ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded transition-colors'
                    : 'w-1/2 ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-3 rounded transition-colors'
                  }`}
                onClick={() => handleResponse(index, 'No')}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-indigo-700 mt-4">{success}</div>
      {!submitted && (
        <button
          className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded mt-4"
          onClick={handleSubmit}
        >
          Submit Responses
        </button>
      )}
    </div>
  );
}

export default PickRestaurants;
