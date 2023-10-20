import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import "./viewProfile.css";
import { db, auth } from "./firebase";
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

function ViewProfile() {

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const history = useHistory();
  const navigateToProfile = () => {
    // Implement the logic for creating a party
    history.push("/profile");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const docUsers = doc(db, "Users", auth.currentUser.email);
        console.log("HERE");
        console.log(auth.currentUser.email);
        const docUserInfo = await getDoc(docUsers);
        console.log("Doc Data: ", docUserInfo.data());
        if (docUserInfo.exists()) {
          //setMyParties(docParties.data().party)
          const dat = docUserInfo.data();
          console.log("Got it");
          if ('name' in dat) {
            setName(dat.name);
          }
          else {
            setName(auth.currentUser.displayName)
          }
          if ('city' in dat) {
            setCity(dat.city);
          }
          if ('zipCode' in dat) {
            setZipCode(dat.zipCode);
          }

        } else {
          console.log("User email does not exist")
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    fetchUserInfo();
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold mt-2 mb-4">
        Profile
      </h1>
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="form-group mb-4">
          <label className="text-lg font-semibold">Name:</label>
          <div className="text-gray-700">{name}</div>
        </div>
        <div className="form-group mb-4">
          <label className="text-lg font-semibold">Current City:</label>
          <div className="text-gray-700">{city}</div>
        </div>
        <div className="form-group mb-4">
          <label className="text-lg font-semibold">Zip Code:</label>
          <div className="text-gray-700">{zipCode}</div>
        </div>
        <button
          className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded w-full"
          onClick={navigateToProfile}
        >
          Edit Profile
        </button>
      </div>
      <Link to="/homepage" className="text-indigo-700 mt-4">Go Back</Link>
    </div>

  );
}


export default ViewProfile;


