const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const yelp = require('yelp-fusion');
const apiKey = 'cSR7W49KfeuavvdvjsIprf8QuDTpBdktA7PHxvJgZnRFnsuIVmJRzKY5Qhcx3BJo-gDgZhjXv6-rqIWuarA-gfJ4B8_JnyVIFyAHeWa6_ha5d6HkRhWCHPyDOw0aZXYx'; // Replace with your Yelp API key

const app = express();
app.use(bodyParser.json());
app.use(cors());

const yelpClient = yelp.client(apiKey);

app.get('/yelpAPI2', async (req, res) => {
  try {
    const zipcode = req.query.zipcode;

    const searchRequest = {
      location: zipcode,
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

app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});

