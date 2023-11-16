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
  const currentUser = sessionStorage.getItem('username');
  const location = useLocation();
  const { zipcode, party } = location.state;
  const [users, setUsers] = useState([]);
  const [noMatchesFound, setNoMatchesFound] = useState(false);
  const [preferencesNotFilled, setPreferencesNotFilled] = useState(false);

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
      const resultsRef = collection(db, 'Results');
      try {
        if (users.length === 0) {
          const userResultsQuery = query(resultsRef, where('party', '==', party), where('user', '==', currentUser));
          const userResultsSnapshot = await getDocs(userResultsQuery);
          if (userResultsSnapshot && userResultsSnapshot.docs) {
            const userResultsData = userResultsSnapshot.docs.map((doc) => doc.data().result).flat();
            const yelpData = await fetchYelpData(zipcode);
            const userPreferredRestaurants = userResultsData.map((result, index) =>
              result === 'Yes' ? yelpData.businesses[index] : null
            );

            setCommonRestaurants(userPreferredRestaurants.filter((restaurant) => restaurant !== null));
          } else {
            console.error('USERS = 0 Error fetching user results: User results snapshot is not as expected.');
          }
        }

        const userResults = [];

        for (const user of users) {
          const userResultsQuery = query(resultsRef, where('party', '==', party), where('user', '==', user));
          const userResultsSnapshot = await getDocs(userResultsQuery);
          if (userResultsSnapshot && userResultsSnapshot.docs) {
            const userResultsData = userResultsSnapshot.docs.map((doc) => doc.data().result).flat();
            if (userResultsData.length === 0) {
              setPreferencesNotFilled(true);
              return;
            }
            userResults.push(userResultsData);
          } else {
            console.error('USERS> 0 Error fetching user results: User results snapshot is not as expected.');
          }
        }

        let commonIndices = userResults[0].map((_, index) => index);

        for (const userResult of userResults) {
          commonIndices = commonIndices.filter((index) => userResult[index] === 'Yes');
        }
        if (commonIndices.length === 0) {
          setNoMatchesFound(true);
          return;
        }

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
        Authorization: 'Bearer svwYnE5CJtU89nxVua5FnmjVZVLr-fw560J8QbCfoGabOr7YDL2b1e_fIrqgL0zNL7prcURHDPkQha3D9WiRy_MYCdwmtBPoYdE96FIWWaKCYfA6RkDQAhtTAWVBZXYx',
      },
    };

    const response = await fetch(`https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=12&radius=1600&location=${zipcode}`, options);
    return response.json();
  };

  const copyRestaurantNames = () => {
    const restaurantNames = commonRestaurants.map((restaurant) => restaurant.name).join('\n');
    const textArea = document.createElement('textarea');
    textArea.value = restaurantNames;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Link to="/joinParty" className="text-indigo-700 mb-4">
        Go Back
      </Link>
      <h1 className="text-4xl font-semibold mb-4">Restaurants All Users Agree On</h1>
      {noMatchesFound && <p>No matches found.</p>}
      {preferencesNotFilled && <p>Some users have not filled out their preferences yet.</p>}
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
      {commonRestaurants.length > 0 && (
        <button
          onClick={copyRestaurantNames}
          className="bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded mt-4"
        >
          Share Results
        </button>
      )}
    </div>
  );
}

export default Results;
