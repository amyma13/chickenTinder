import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import "./profile.css";
import { db, auth } from "./firebase";
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

function Profile() {

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const docUsers = doc(db, "Users", auth.currentUser.email); 
        console.log("HERE");
        console.log(auth.currentUser.email); 
        const docUserInfo = await getDoc(docUsers); 
        console.log("Doc Data:", docUserInfo.data());
        if (docUserInfo.exists()){
            //setMyParties(docParties.data().party)
            const dat = docUserInfo.data();
            console.log("Got it");
            let name = "";
            let city = "";
            let zipCode ="";
            if ('name' in dat){
              name = dat.name;
            }
            else{
              name = auth.currentUser.displayName;
            }
            if ('city' in dat){
              city = dat.city;
            }
            if ('zipCode' in dat){
              zipCode = dat.city;
            }
            setFormData({name: name, city: city, zipCode: zipCode});
            
        } else {
            console.log("User not found")
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    fetchUserInfo(); 
  },[])

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
      await updateDoc(doc(ref, auth.currentUser.email), {
        name: formData.name,
        city: formData.city,
        zipCode: formData.zipCode
      });
      console.log("profile updated");
    }
    catch (error){
      console.log("Error: "+error);
    }
    history.push("/viewProfile");
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Current City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Zip Code:</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>

      <Link to="/viewProfile">Go Back</Link>
    </div>
  );
}

export default Profile;
