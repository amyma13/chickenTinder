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

      await setDoc(doc(ref, formData.partyName), {
        partyName: formData.partyName,
        password: formData.password,
        zipcode: formData.zipcode,
        users: [auth.currentUser.email],
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
      });
      setSuccess('Party successfully created');
    } catch (error) {
      console.log('Error: ' + error);
      setSuccess('Party unable to be created');
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold mt-2 mb-4">
        Create Party
      </h1>
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="text-lg font-semibold">Party Name:</label>
            <input
              type="text"
              name="partyName"
              value={formData.partyName}
              onChange={handleChange}
              required
              className="text-gray-700 border border-indigo-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="form-group mb-4">
            <label className="text-lg font-semibold">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="text-gray-700 border border-indigo-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="form-group mb-4">
            <label className="text-lg font-semibold">Zip Code:</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              required
              className="text-gray-700 border border-indigo-400 rounded w-full py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded w-full"
          >
            Create Party
          </button>
        </form>
        <div className="text-indigo-700 mt-4">{success}</div>
      </div>
      <Link to="/homepage" className="text-indigo-700 mt-4">Go Back</Link>
    </div>
  );
}

export default CreateParty;

