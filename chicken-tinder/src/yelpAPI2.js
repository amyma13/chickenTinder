const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const yelp = require('yelp-fusion');
const apiKey = 'cSR7W49KfeuavvdvjsIprf8QuDTpBdktA7PHxvJgZnRFnsuIVmJRzKY5Qhcx3BJo-gDgZhjXv6-rqIWuarA-gfJ4B8_JnyVIFyAHeWa6_ha5d6HkRhWCHPyDOw0aZXYx'; // Replace with your Yelp API key

const app = express();
app.use(bodyParser.json());
app.use(cors());

const URL = 'https://ipgeolocation.abstractapi.com/v1/?api_key=d0932fd4c4e44d0ab5a0e2c23e606015';

const sendAPIRequest = async () => {
  try {
    const ipAPIresponse = await axios.get(URL);
    const publicIPAddress = ipAPIresponse.data.ip_address;
    const locationAPIResponse = await axios.get(`${URL}&ip_address=${publicIPAddress}`);
    const location = {
      longitude: locationAPIResponse.data.longitude,
      latitude: locationAPIResponse.data.latitude,
    };
    return location;
  } catch (error) {
    throw error;
  }
};

const yelpClient = yelp.client(apiKey);

app.get('/yelpAPI2', async (req, res) => {
  try {
    const location = await sendAPIRequest();
    console.log(location);

    const searchRequest = {
      latitude: location.latitude,
      longitude: location.longitude,
      radius: 1600,
      sort_by: 'best_match',
      limit: 12,
    };

    const restaurantsResponse = await yelpClient.search(searchRequest);
    const restaurants = restaurantsResponse.jsonBody.businesses;
    console.log(restaurants[0].categories[0].alias);

    // Extract relevant information for each restaurant
    const restaurantObjects = restaurants.map((restaurant) => ({
      name: restaurant.name,
      address: restaurant.location.address1,
      categories : restaurant.categories[0].title,
      image: restaurant.image_url
      // Add more properties as needed
    }));

    // Send the restaurant objects as JSON to the front end
    res.json(restaurantObjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching public IP address and/or location' });
  }
});

app.get('/getIpAddress', (req, res) => {
  const clientIpAddress = req.ip; // This retrieves the client's IP address
  res.send(`Client IP Address: ${clientIpAddress}`);
});

const {addEmail} = require('./firebase')

  app.post('/login', async (req, res) => {
    console.log(req.body.email);

    const userAccount = await addEmail({user: req.body.email});
    console.log("USER ACCOUNT: "+userAccount);
    if (userAccount){
      console.log("SUCCESS");
      res.send({success: true});
      return;
    }
    console.log("FAILURE");
    res.send({success: false});
  });

app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});

