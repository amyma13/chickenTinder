import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import "./joinParty.css";
import { Link } from 'react-router-dom';
import { db, auth } from "./firebase";
import { collection, doc, setDoc, getDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { getNodeText } from '@testing-library/react';

function JoinParty() {

  const username = sessionStorage.getItem("username");
  const history = useHistory();

  const [success, setSuccess] = useState('');

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

  const [myParties, setMyParties] = useState([]);
  const [myZips, setMyZips] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // You can handle the form submission logic here (joining a party)
      console.log('Form submitted:', formData);

      const docRef = doc(db, "Party", formData.partyName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        if (docSnap.data().password == formData.password) {
          console.log("PASSWORD CORRECT");
          setSuccess("Party successfully joined");
          const refEmail = doc(db, "Users", username);

          // Atomically add a new region to the "regions" array field.
          await updateDoc(refEmail, {
            party: arrayUnion(formData.partyName)
          });
          console.log("FETCHINGKLGKSJLDF")
          fetchParties();
        }
        else {
          console.log("WRONG PASSWORD");
          setSuccess("Wrong password");
        }
      } else {
        setSuccess("No party with that name exists");
      }

      setFormData({
        partyName: '',
        password: '',
      });
    }
    catch (error) {
      console.log("Error: " + error);
      setSuccess("Party unable to be created");
    }
  };

  const fetchParties = async () => {
    try {
      // const parties = []; // Fetch parties from your database
      const docUsers = doc(db, "Users", username);
      const docParties = await getDoc(docUsers);
      console.log("Doc Data:", docParties.data());
      if (docParties.exists()) {
        setMyParties(docParties.data().party)
      } else {
        // setMyParties([]); 
        setMyParties(myParties || []);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  useEffect(() => {
    const fetchZipCodes = async () => {
      const zips = [];
      for (let index = 0; index < myParties.length; index++) {
        try {
          const party = myParties[index];
          const docP = doc(db, "Party", party);
          const docParties = await getDoc(docP);

          if (docParties.exists()) {
            console.log(docParties.data().zipcode);
            zips.push(docParties.data().zipcode);
          }
        } catch (error) {
          console.error('Error fetching party:', error);
        }
      }
      setMyZips(zips);
    };

    fetchZipCodes();
  }, [myParties]);


  const navigateToViewRestaurants = (index) => {
    const x = myZips[index];
    history.push('/pickRestaurants', { zipcode: x, party: myParties[index] });
  };

  const navigateToViewResults = (index) => {
    const x = myZips[index];
    console.log("2: " + myParties[index]);
    history.push('/results', { zipcode: x, party: myParties[index] });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold mt-2 mb-4">
        Join a Party
      </h1>
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4">
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
            <button
              type="submit"
              className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded w-full"
            >
              Join
            </button>
            <div className="text-indigo-700 mt-4">{success}</div>
          </form>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <div className="my-parties">
            <h2 className="text-2xl font-semibold mb-4">My Parties</h2>
            <ul>
              {myParties && myParties.length > 0 ? (
                myParties.map((party, index) => (
                  <li key={index} className="mb-4">
                    <h4 className="text-lg font-semibold">{party}</h4>
                    <button
                      className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded mr-2"
                      onClick={() => navigateToViewRestaurants(index, party)}
                    >
                      Pick Restaurants
                    </button>
                    <button
                      className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded"
                      onClick={() => navigateToViewResults(index, party)}
                    >
                      View Results
                    </button>
                  </li>
                ))
              ) : (
                <li>No parties available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Link to="/homepage" className="text-indigo-700 mt-4">Go Back</Link>
    </div>
  );
}

export default JoinParty;
