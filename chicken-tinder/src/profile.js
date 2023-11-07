import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { db, auth } from "./firebase";
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

function Profile() {

  const username = sessionStorage.getItem("username");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const docUsers = doc(db, "Users", username);
        const docUserInfo = await getDoc(docUsers);
        console.log("Doc Data:", docUserInfo.data());
        if (docUserInfo.exists()) {
          //setMyParties(docParties.data().party)
          const dat = docUserInfo.data();
          console.log("Got it");
          let name = "";
          let city = "";
          let zipCode = "";
          if ('name' in dat) {
            name = dat.name;
          }
          else {
            name = auth.currentUser.displayName;
          }
          if ('city' in dat) {
            city = dat.city;
          }
          if ('zipCode' in dat) {
            zipCode = dat.zipCode;
          }
          setFormData({ name: name, city: city, zipCode: zipCode });

        } else {
          console.log("User not found")
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    fetchUserInfo();
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    zipCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle the form submission logic here
    console.log('Form submitted:', formData);

    try {
      const ref = collection(db, "Users");
      console.log(auth.currentUser.email);
      await updateDoc(doc(ref, username), {
        name: formData.name,
        city: formData.city,
        zipCode: formData.zipCode
      });
      console.log("profile updated");
    }
    catch (error) {
      console.log("Error: " + error);
    }
    history.push("/viewProfile");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold mt-2 mb-4">
        Profile
      </h1>
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="text-lg font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="text-gray-700 border border-indigo-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="form-group mb-4">
            <label className="text-lg font-semibold">Current City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="text-gray-700 border border-indigo-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="form-group mb-4">
            <label className="text-lg font-semibold">Zip Code:</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              className="text-gray-700 border border-indigo-400 rounded w-full py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded w-full"
          >
            Submit
          </button>
        </form>
      </div>
      <Link to="/viewProfile" className="text-indigo-700 mt-4">Go Back</Link>
    </div>
  );
}

export default Profile;
