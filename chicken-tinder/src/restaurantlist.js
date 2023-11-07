// restaurantlist.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold mt-2 mb-4">Restaurant List:</h1>
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {restaurantData.map((restaurant, index) => (
            <li key={index} className="border p-4 rounded">
              <div className="restaurant-card">
                <h2 className="text-lg font-semibold">{restaurant.name}</h2>
                <p>Distance: {restaurant.distance}</p>
                <p>Type of Cuisine: {restaurant.cuisine}</p>
                <p>Rating: {restaurant.rating}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`cursor-pointer mr-2 checkmark-icon ${selectedRestaurants.includes(restaurant.name) ? 'selected' : ''
                      }`}
                    onClick={() => handleToggleRestaurant(restaurant.name)}
                  >
                    &#10003; {/* Checkmark */}
                  </span>
                  <span
                    className="cursor-pointer x-icon"
                    onClick={() => handleToggleRestaurant(restaurant.name)}
                  >
                    &#10006; {/* X */}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Link to="/homepage" className="text-indigo-700 mt-4">Go Back</Link>
    </div>
  );
}

export default RestaurantList;
