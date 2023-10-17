import React, { useEffect, useState } from 'react';

function ListOfRestaurants() {
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
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Restaurant List</h1>
      <ul>
        {restaurants.map((item) => (
          <li key={item.name} style={styles.restaurantItem}>
            <h2 style={styles.restaurantName}>{item.name}</h2>
            <p>{`Address: ${item.address}`}</p>
            <p>{`City: ${item.city}`}</p>
            <p>{`State: ${item.state}`}</p>
            <p>{`Postal Code: ${item.postalCode}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  restaurantItem: {
    marginBottom: '16px',
  },
  restaurantName: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default ListOfRestaurants;
