// restaurantlist.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './restaurantlist.css';

function RestaurantList() {
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);

  const restaurantData = [
    'Corner 17',
    'Lonas Lil Eats',
    'Union Loafers',
    'Louie',
    'Balkan Treat Box',
    'Mayo Ketchup',
    'Thai Country Cafe',
    'Olio',
  ];

  const handleToggleRestaurant = (restaurant) => {
    if (selectedRestaurants.includes(restaurant)) {
      setSelectedRestaurants(selectedRestaurants.filter((r) => r !== restaurant));
    } else {
      setSelectedRestaurants([...selectedRestaurants, restaurant]);
    }
  };

  return (
    <div className="restaurant-list-container">
      <h1>Restaurant List:</h1>
      <div className="restaurant-cards">
        <ul>
        {restaurantData.map((restaurant, index) => (
          <li>
            <div className="restaurant-card" key={index}>
              <h2>{restaurant}</h2>
              <p>Distance: X mi</p>
              <p>Type of Cuisine: Cuisine Type</p>
              <p>Rating: X.X</p>
              <span
                className={`checkmark-icon ${
                  selectedRestaurants.includes(restaurant) ? 'selected' : ''
                }`}
                onClick={() => handleToggleRestaurant(restaurant)}
              >
                &#10003; {/* Checkmark */}
              </span>
              <span
                className="x-icon"
                onClick={() => handleToggleRestaurant(restaurant)}
              >
                &#10006; {/* X */}
              </span>
            </div>
            </li>
        ))}
        </ul>
      </div>
      <Link to="/homepage">Go Back</Link>
    </div>
  );
}

export default RestaurantList;
