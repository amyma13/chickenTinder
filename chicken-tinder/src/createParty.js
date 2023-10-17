import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from "./firebase";
import { collection, doc, setDoc, arrayUnion, updateDoc } from "firebase/firestore"; 
import { v4 as uuidv4 } from 'uuid';
import "./createParty.css";


function CreateParty() {

  const [formData, setFormData] = useState({
    partyName: '',
    password: '',
    zipcode: '', // Added zipcode field
    inviteUser: '', // Added inviteUser field
    id: ''
  });

  const [success, setSuccess] = useState('');

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
  
    const uniqueId = uuidv4(); // Generate a unique ID
  
    console.log('Form submitted:', formData);
    try {
      const ref = collection(db, 'Party');
      console.log(auth.currentUser.email);
  
      await setDoc(doc(ref, uniqueId), {
        partyName: formData.partyName,
        password: formData.password,
        zipcode: formData.zipcode,
        invitedUsers: formData.inviteUser,
      });
  
      const refEmail = doc(db, 'Users', auth.currentUser.email);
  
      // Atomically add a new region to the "regions" array field.
      await updateDoc(refEmail, {
        party: arrayUnion(formData.partyName),
      });
  
      setFormData({
        partyName: '',
        password: '',
        zipcode: '',
        inviteUser: '',
        //id: uniqueId, // Set the ID to the generated unique ID
      });
      setSuccess('Party successfully created');
    } catch (error) {
      console.log('Error: ' + error);
      setSuccess('Party unable to be created');
    }
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
        <div className="form-group">
          <label>Zip Code:</label>
          <input
            type="text" // Changed type to 'text'
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
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
      <div>{success}</div>
      <Link to="/homepage">Go Back</Link>
    </div>
  );
}

export default CreateParty;

