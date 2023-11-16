import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from "./firebase";
import { collection, doc, getDoc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';

function CreateParty() {

  const username = sessionStorage.getItem("username");
  const history = useHistory();

  const [formData, setFormData] = useState({
    partyName: '',
    password: '',
    zipcode: '',
    inviteUser: '',
    id: ''
  });


  const [success, setSuccess] = useState('');
  const [partyMessage, setPartyMessage] = useState('');
  const [zip, setZip] = useState('');
  const [party_name, setPartyName] = useState('');

  const fetchUserZipcode = async () => {
    try {
      const userRef = doc(db, 'Users', username);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData((prevData) => ({
          ...prevData,
          zipcode: userData.zipCode || '',
        }));
      } else {
        console.log('User document not found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uniqueId = uuidv4();

    try {
      const ref = collection(db, 'Party');
      const currentUser = sessionStorage.getItem('username');

      await setDoc(doc(ref, formData.partyName), {
        partyName: formData.partyName,
        password: formData.password,
        zipcode: formData.zipcode,
        users: [currentUser],
      });

      const refEmail = doc(db, 'Users', username);

      await updateDoc(refEmail, {
        party: arrayUnion(formData.partyName),
      });

      const partyLink = "https://chicken-tinder-omega.vercel.app";

      const message = `You’ve been invited to a ${formData.partyName} party! Click the link and join the party.
Party Name: ${formData.partyName}
Password: ${formData.password}
${partyLink}`;

      setZip(formData.zipcode);
      setPartyName(formData.partyName);

      setFormData({
        partyName: '',
        password: '',
        zipcode: '',
      });
      setSuccess('Party successfully created');
      setPartyMessage(message);
    } catch (error) {
      console.log('Error: ' + error);
      setSuccess('Party unable to be created');
    }
  };

  const copyPartyMessage = () => {
    const textArea = document.createElement("textarea");
    // Remove HTML tags from the message before copying
    textArea.value = partyMessage.replace(/<[^>]+>/g, '');
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const navigateToViewRestaurants = () => {
    console.log("ZIPCODE: "+zip); //zipcode
    console.log("PARTY:"+party_name); //party name
    history.push('/pickRestaurants', { zipcode: zip, party: party_name });
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
            <div className="flex items-center">
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
                className="text-gray-700 border border-indigo-400 rounded w-full py-2 px-3 ml-2"
              />
              <button
                type="button"
                onClick={fetchUserZipcode}
                className="ml-2 bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded"
              >
                Use My Zip Code
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-indigo-700 hover-bg-purple-700 text-white font-bold py-3 px-4 rounded w-full"
          >
            Create Party
          </button>
        </form>
        <div className="text-indigo-700 mt-4">{success}</div>
        {partyMessage && (
          <div className="mt-4 flex gap-4">
            <button
              onClick={copyPartyMessage}
              className="flex-1 bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded"
            >
              Copy Party Invitation
            </button>
            {/* <Link
              to="/joinParty"
              className="flex-1 bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
            >
              Pick Restaurants
            </Link> */}
            <button
              onClick = {navigateToViewRestaurants}
              className="flex-1 bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
            >
              Pick Restaurants
            </button>
          </div>
        )}



      </div>
      <Link to="/homepage" className="text-indigo-700 mt-4">Go Back</Link>
    </div>
  );
}

export default CreateParty;