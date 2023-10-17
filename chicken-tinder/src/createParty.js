import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore"; 

function CreateParty() {

  const [formData, setFormData] = useState({
    partyName: '',
    password: '',
    zipcode: '', // Added zipcode field
    inviteUser: '' // Added inviteUser field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle the form submission logic here
    console.log('Form submitted:', formData);
    const ref = collection(db, "Party");

        await setDoc(doc(ref, formData.partyName), {
            partyName: formData.partyName,
            password: formData.password,
            zipcode: formData.zipcode,
            invitedUsers: formData.inviteUser
        });
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
            type="text" // Changed type to 'text'
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inviteUser-group">
          <label>Invite User:</label>
          <input
            type="text" // Changed type to 'text'
            name="inviteUser"
            value={formData.inviteUser}
            onChange={handleChange}
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

