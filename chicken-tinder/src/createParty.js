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
  const [error, setError] = useState('');

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

  const fetchCurrentLocation = async () => {
  try {
    // Check if geolocation is supported in the browser
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { coords } = position;
        const { latitude, longitude } = coords;

        // Use a reverse geocoding service to get the user's zipcode from latitude and longitude
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await response.json();

        // Access the zipcode from the response data
        const userZipcode = data.postcode || '';

        // Update the form data with the retrieved zipcode
        setFormData((prevData) => ({
          ...prevData,
          zipcode: userZipcode,
        }));
      });
    } else {
      console.log('Geolocation is not supported in this browser.');
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

  const checkDuplicates = async (partyName) => {
    try {
      const partyRef = doc(db, 'Users', partyName);
      const partyDoc = await getDoc(partyRef);

      if (partyDoc.exists()) {
        console.log("ExISTS");
        setError('Party name already exists');
        return true;
      } else {
        console.log("NOT EXIST");
        setError('');
        return false;
      }
    } catch (error) {
      setError('Error fetching user data:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const uniqueId = uuidv4();

    const duplicate = await checkDuplicates(formData.partyName);

    console.log("DUP: "+duplicate);

    if (!duplicate){

      console.log("Creating party now");

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
      setError('Party unable to be created: '+error);
    }
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
                onClick={fetchCurrentLocation}
                className="ml-2 bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded"
              >
                Use My Current Location
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
        {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        </div>
                    )}
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