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
  const [commonIndices, setCommonIndices] = useState([]);
  const currentUser = auth.currentUser.email;
  const location = useLocation();
  const { zipcode, party } = location.state;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const partyRef = doc(db, 'Party', party);
        const docSnap = await getDoc(partyRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const otherUsers = data.users.filter((user) => user !== currentUser);
          if (otherUsers.length > 0) {
            setUsers([currentUser, ...otherUsers]);
          }
        } else {
          console.log('Party does not exist');
        }
      } catch (error) {
        console.error('Error fetching party:', error);
      }
    };

    fetchPartyData();
  }, [party, currentUser]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      console.log('fetching restaurant data');
      const resultsRef = collection(db, 'Results');

      try {
        if (users.length === 0) {
          console.log('No users in this party');
          return;
        }

        // Create an array to store user results.
        const userResults = [];

        // Fetch results for each user in the party.
        for (const user of users) {
          const userResultsQuery = query(resultsRef, where('party', '==', party), where('user', '==', user));
          const userResultsSnapshot = await getDocs(userResultsQuery);
          const userResultsData = userResultsSnapshot.docs.map((doc) => doc.data().result).flat();
          userResults.push(userResultsData);
        }

        // Initialize commonIndices with all indices.
        let tempCommonIndices = userResults[0].map((_, index) => index);
        setCommonIndices(tempCommonIndices);

        // Compare results and find common indices.
        for (const userResult of userResults) {
          const temp = commonIndices.filter((index) => userResult[index] === 'Yes');
          setCommonIndices(temp);
        }
        console.log(commonIndices);

        const yelpData = await fetchYelpData(zipcode);
        const commonRestaurantsData = commonIndices.map((index) => yelpData.businesses[index]);

        setCommonRestaurants(commonRestaurantsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRestaurantData();
  }, [party, users, zipcode]);

  const fetchYelpData = async (zipcode) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer n1vgxCT7H7rPMv0Ed2EuFhCb049rxhsD08h8t1mxI7CfUry614nt5iDETm9nPKnrvujYoJV-VzisbZ6QscRN_Dh3ctLDuxZbrp_rZhlKL7HbCctZQeE2XfEWpgM3ZXYx',
      },
    };

    const response = await fetch(`https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=12&radius=1600&location=${zipcode}`, options);
    return response.json();
  };


  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Link to="/joinParty" className="text-indigo-700 mb-4">
        Go Back
      </Link>
      <h1 className="text-4xl font-semibold mb-4">Restaurants All Users Agree On</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {commonRestaurants.map((item) => (
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
        ))}
      </div>
    </div>
  );
}

export default Results;
