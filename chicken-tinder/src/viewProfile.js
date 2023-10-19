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
        if (docUserInfo.exists()){
            //setMyParties(docParties.data().party)
            const dat = docUserInfo.data();
            console.log("Got it");
            if ('name' in dat){
              setName(dat.name);
            }
            else{
              setName(auth.currentUser.displayName)
            }
            if ('city' in dat){
              setCity(dat.city);
            }
            if ('zipCode' in dat){
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
  },[])

  return (
    <div className="profile-container">
    <div>
      <h1>Profile</h1>
        <div className="form-group">
          <label>Name:</label><div>{name}</div>
        </div>
        <div className="form-group">
          <label>Current City:</label><div>{city}</div>
        </div>
        <div className="form-group">
          <label>Zip Code:</label><div>{zipCode}</div>
        </div>
        <button type="submit" className="submit-button" onClick={navigateToProfile}>Edit Profile</button>
        </div>
      <Link to="/homepage">Go Back</Link>
    </div>
  );
}

export default ViewProfile;


