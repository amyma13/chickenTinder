import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { db, auth } from './firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'; 

function Results() {
  const [commonRestaurants, setCommonRestaurants] = useState([]);
  const user1 = auth.currentUser.email;

  const location = useLocation();
  const { zipcode, party } = location.state;
  const [user2, setUser2] = useState(''); // State to store user2's email

  useEffect(() => {
    const partyRef = doc(db, 'Party', party);

    getDoc(partyRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const users = data.users;
          const foundUser2 = users.find((user) => user !== user1);
          if (foundUser2) {
            setUser2(foundUser2);
          }
        } else {
          console.log('Party does not exist');
        }
      })
      .catch((error) => {
        console.error('Error fetching party:', error);
      });
  }, [party, user1]);

  useEffect(() => {
    if (!user2) {
      setUser2(user1);
    }
    if (user2) {
      const resultsRef = collection(db, 'Results'); // Reference the 'Results' collection
      const user1Results = [];

      const user1ResultsQuery = query(
        resultsRef,
        where('party', '==', party),
        where('user', '==', user1)
      );

      const user2ResultsQuery = query(
        resultsRef,
        where('party', '==', party),
        where('user', '==', user2)
      );

      getDocs(user1ResultsQuery) // Use getDocs to fetch documents
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            user1Results.push(doc.data().result[0]);
          });
          console.log("user1Results:" + user1Results)
          getDocs(user2ResultsQuery) // Use getDocs to fetch documents
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const user2Results = doc.data().result;
                console.log("user2Results:" + user2Results)
                const commonIndices = [];
                for (let i = 0; i < user2Results.length; i++) {
                    console.log(user1Results[i] +" " + user2Results[i]);
                    if(user2Results[i]){
                        console.log(i);
                        commonIndices.push(i);
                        console.log(commonIndices);
                    }
                  }
                console.log("commonIndices:" + commonIndices)

                fetch(`http://localhost:3001/yelpAPI2?zipcode=${zipcode}`)
                  .then((response) => response.json())
                  .then((data) => {
                    const commonRestaurantsData = commonIndices.map((index) => data[index]);
                    setCommonRestaurants(commonRestaurantsData);
                  })
                  .catch((error) => {
                    console.error('Error fetching data:', error);
                  });
              });
            });
        });
    }
  }, [party, user1, user2, zipcode]);

  return (
    <div>
      <Link to="/joinParty">Go Back</Link>
      <h1>Restaurants Both Users Agree On</h1>
      <div className="restaurants">
        <ul>
          {commonRestaurants.map((item, index) => (
            <li key={index}>
              <div className="restaurant">
                <img src={item.image} alt={item.name} />
                <h2>{item.name}</h2>
                <p>{`Address: ${item.address}`}</p>
                <p>{`Cuisine: ${item.categories}`}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Results;
