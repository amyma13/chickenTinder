import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./pickRestaurants.css";

function PickRestaurants() {
    const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Make a GET request to your Express server
    fetch('http://localhost:3001/yelpAPI2')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Update the state with the fetched data
        setRestaurants(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <Link to="/joinParty" >Go Back</Link>
      <h1>Would You Eat At These Restaurants?</h1>
      <div className="restaurants">
        <ul>
        {restaurants.map((item) => (
            <li>
                <div className="restaurant" key={item.name}>
                        <img src={item.image} alt={item.name} /> 
                        <h2>{item.name}</h2>
                        <p>{`Address: ${item.address}`}</p>
                        <p>{`Cuisine: ${item.categories}`}</p>
                        <div className='response-buttons'>
                        <button className="yes-button">Yes</button>
                        <button className="no-button">No</button> 
                    </div>
                </div>
            </li>
        ))}
        </ul>
      </div>
      
    </div>
  );
};

export default PickRestaurants;
