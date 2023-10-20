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
  const {zipcode, party} = location.state;

    const handleResponse = (index, response) => {
      console.log(index);
      const updatedResponses = [...userResponses];
      updatedResponses[index] = response === 'Yes'; 
      setUserResponses(updatedResponses);
      console.log(updatedResponses);
    };
  
    const handleSubmit = async () => {

      console.log(userResponses);
      setSubmitted(true);
      try {
        console.log(party);
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
  
      history.push("/results", { zipcode: zipcode, party: party});
    };


  useEffect(() => {
    // Make a GET request to your Express server
    fetch(`http://localhost:3001/yelpAPI2?zipcode=${zipcode}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Update the state with the fetched data
        setRestaurants(data);
        const initialResponses = Array(data.length).fill(false);
        setUserResponses(initialResponses);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <Link to="/joinParty">Go Back</Link>
      <h1>Would You Eat At These Restaurants?</h1>
      <div className="restaurants">
        <ul>
          {restaurants.map((item, index) => (
            <li key={item.id}>
              {/* Restaurant details */}
              <div className="restaurant">
                <img src={item.image} alt={item.name} />
                <h2>{item.name}</h2>
                <p>{`Address: ${item.address}`}</p>
                <p>{`Cuisine: ${item.categories}`}</p>
              </div>
                <div className='response-buttons'>
                  <button className="yes-button" onClick={() => handleResponse(index, 'Yes')}>
                    Yes
                  </button>
                  <button className="no-button" onClick={() => handleResponse(index, 'No')}>
                    No
                  </button>
                </div>
            </li>
          ))}
        </ul>
      </div>
      <div>{success}</div>
      {!submitted && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Responses
        </button>

      )}
    </div>
    
  );
};

export default PickRestaurants;
