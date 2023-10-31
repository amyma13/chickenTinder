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
  const user1 = auth.currentUser.email;
  const location = useLocation();
  const { zipcode, party } = location.state;
  const [user2, setUser2] = useState([]);

  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const partyRef = doc(db, 'Party', party);
        const docSnap = await getDoc(partyRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const foundUser2 = data.users.find((user) => user !== user1);
          if (foundUser2) {
            setUser2([foundUser2]);
          }
        } else {
          console.log('Party does not exist');
        }
      } catch (error) {
        console.error('Error fetching party:', error);
      }
    };

    fetchPartyData();
  }, [party, user1]);

  useEffect(() => {
    if (user2.length === 0) {
      // No need to fetch restaurant data when there's no user2.
      return;
    }

    const fetchRestaurantData = async () => {
      console.log('fetching restaurant data');
      const resultsRef = collection(db, 'Results');
      try {
        const user1ResultsQuery = query(resultsRef, where('party', '==', party), where('user', '==', user1));
        const user2ResultsQuery = query(resultsRef, where('party', '==', party), where('user', '==', user2[0]));

        const [user1ResultsSnapshot, user2ResultsSnapshot] = await Promise.all([
          getDocs(user1ResultsQuery),
          getDocs(user2ResultsQuery),
        ]);

        const user1Results = user1ResultsSnapshot.docs.map((doc) => doc.data().result).flat();
        const user2Results = user2ResultsSnapshot.docs.map((doc) => doc.data().result).flat();
        console.log("user2Results");
        console.log(user2Results);

        const userResults = user2Results
        .map((result, index) => user1Results[index] === 'Yes' && result === 'Yes' ? index : -1)
        .filter((index) => index !== -1);
        setCommonIndices(userResults);
        
        console.log("commonIndices");
        console.log(commonIndices);

        const yelpData = await fetchYelpData(zipcode);
        const commonRestaurantsData = commonIndices.map((index) => yelpData.businesses[index]);

        setCommonRestaurants(commonRestaurantsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRestaurantData();
  }, [party, user1, user2, zipcode, commonIndices]);

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
      <h1 className="text-4xl font-semibold mb-4">Restaurants Both Users Agree On</h1>
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
