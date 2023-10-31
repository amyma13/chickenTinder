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
          console.log("we found user 2? " + foundUser2);
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
    console.log("user 2? " + user2);
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

      console.log("user 2 query " + user2ResultsQuery);


      getDocs(user1ResultsQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const resultData = doc.data().result;
          resultData.forEach((element) => {
            user1Results.push(element);
        });
      });

      console.log("user1Results:" + user1Results)

          getDocs(user2ResultsQuery) // Use getDocs to fetch documents
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const user2Results = doc.data().result;
                console.log("user2Results:" + user2Results)
                const commonIndices = [];
                for (let i = 0; i < user2Results.length; i++) {
                  console.log(user1Results[i] + " " + user2Results[i]);
                  if (user1Results[i]==user2Results[i]) {
                    commonIndices.push(i);
                  }
                }
                console.log("commonIndices:" + commonIndices)
                const options = {method: 'GET', headers: {accept: 'application/json', Authorization: 'Bearer n1vgxCT7H7rPMv0Ed2EuFhCb049rxhsD08h8t1mxI7CfUry614nt5iDETm9nPKnrvujYoJV-VzisbZ6QscRN_Dh3ctLDuxZbrp_rZhlKL7HbCctZQeE2XfEWpgM3ZXYx' }};
                fetch(`https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=12&radius=1600&location=${zipcode}`, options)
                .then((response) => response.json())
                  .then((data) => {
                    const commonRestaurantsData = commonIndices.map((index) => data.businesses[index]);
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
    <div className="bg-gray-100 min-h-screen p-4">
      <Link to="/joinParty" className="text-indigo-700 mb-4">
        Go Back
      </Link>
      <h1 className="text-4xl font-semibold mb-4">Restaurants Both Users Agree On</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {commonRestaurants.map((item, index) => (
          <div key={item.id} className="border rounded-lg shadow-md p-4">
            <div key={item.id} className="border rounded-lg shadow-md p-4">
            <div className="flex items-start">
              <img src={item.image_url} alt={item.name} className="w-1/2 h-48 object-cover rounded" />
              <div className="w-1/2 ml-4">
                <h2 className="text-2xl font-semibold mb-4">{item.name}</h2>
                <p className="text-gray-700">{`Address: ${item.location.address1}`}</p>
                <p className="text-gray-700">{`Cuisine: ${item.categories[0].title}`}</p>
                <p className="text-gray-700">{`Price: ${item.price}`}</p>
              </div>
            </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results;