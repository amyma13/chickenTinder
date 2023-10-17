import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./joinParty.css";
import { Link } from 'react-router-dom';


function JoinParty() {
  const history = useHistory();

  const navigateToViewRestaurants = () => {
    history.push('/pickRestaurants');
    console.log("AAAAAAAAAA");
  };


  const [formData, setFormData] = useState({
    partyName: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the form submission logic here (joining a party)
    console.log('Form submitted:', formData);
  };

  const myParties = ['Party 1', 'Party 2', 'Party 3']; // Replace with actual data

  return (
    <div className="join-party-container">
      <h1>Join a Party</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Party Name:</label>
          <input
            type="text"
            name="partyName"
            value={formData.partyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="join-button">Join</button>
      </form>

      <div className="my-parties">
        <h2>My Parties</h2>
        <ul>
          {myParties.map((party, index) => (
            <li key={index}>
              {party} 
              <button className="view-restaurants-button" onClick={navigateToViewRestaurants} >Pick Restaurants</button>
              <button className="view-results-button">View Results</button> 
            </li>
          ))}
        </ul>
      </div>
      <Link to="/homepage">Go Back</Link>
    </div>
  );
}

export default JoinParty;
