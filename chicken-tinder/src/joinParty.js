import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import "./joinParty.css";
import { Link } from 'react-router-dom';
import { db, auth } from "./firebase";
import { collection, doc, setDoc, getDoc, arrayUnion, updateDoc } from "firebase/firestore"; 
import { getNodeText } from '@testing-library/react';

function JoinParty() {
  const history = useHistory();

  const navigateToViewRestaurants = () => {
    history.push('/pickRestaurants');
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    // You can handle the form submission logic here (joining a party)
    console.log('Form submitted:', formData);

    const docRef = doc(db, "Party", formData.partyName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        
        if (docSnap.data().password == formData.password){
            console.log("PASSWORD CORRECT");
            setSuccess("Party successfully joined");
        const refEmail = doc(db, "Users", auth.currentUser.email);

        // Atomically add a new region to the "regions" array field.
        await updateDoc(refEmail, {
            party: arrayUnion(formData.partyName)
        });

        }
        else{
            console.log("WRONG PASSWORD");
            setSuccess("Party does not exist");
        }
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such party!");
    } 

        setFormData({
          partyName: '',
          password: '',
        }); 
    }
        catch(error){
            console.log("Error: "+error);
            setSuccess("Party unable to be created");
        }
  }; 



  useEffect(() => {
    // Assuming you have a function to fetch parties from your database
    const fetchParties = async () => {
        console.log("plz tell me were here"); 
      try {
        // const parties = []; // Fetch parties from your database
        const docUsers = doc(db, "Users", auth.currentUser.email); 
        console.log(auth.currentUser.email); 
        const docParties = await getDoc(docUsers); 
        console.log("Doc Data:", docParties.data());
        if (docParties.exists()){
            setMyParties(docParties.data().party) 
        } else {
            // setMyParties([]); 
            setMyParties(myParties || []);
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    fetchParties(); 
    }, []);
//   const myParties = ['Party 1', 'Party 2', 'Party 3']; // Replace with actual data

  return (
    <div className="join-party-container">
      <h1>Join a Party</h1>
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
        <button type="submit" className="join-button">Join</button>
        <div>{success}</div>
      </form>

      <div className="my-parties">
        <h2>My Parties</h2>
        <ul>
        {myParties && myParties.length > 0 ? (
            myParties.map((party, index) => (
              <li key={index}>
                {party}
                <button className="view-restaurants-button" onClick={navigateToViewRestaurants}>
                </button>
                <button className="view-results-button">View Results</button>
              </li>
            ))
          ) : (
            <li>No parties available</li>
          )}
        </ul>
      </div>
      <Link to="/homepage">Go Back</Link>
    </div>
  );
}

export default JoinParty;
