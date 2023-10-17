import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CreateParty() {

    useEffect(() => {
        console.log("CREATE PARTY")
      }, []);


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
    // You can handle the form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="create-party-container">
      <h1>Create Party</h1>
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
        <div className="zipcode-group">
          <label>Zip Code:</label>
          <input
            type="zipcode"
            name="zipcode"
            required
          />
        </div>
        <div className="inviteUser-group">
          <label>Invite User:</label>
          <input
            type="inviteUser"
            name="inviteUser"
            required
          />
        </div>
        <button type="submit" className="submit-button">Create Party</button>
      </form>
      <Link to="/homepage">Go Back</Link>
    </div>
  );
}

export default CreateParty;
