// Application dependencies
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');

// Setup Application
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// Route definitions
app.use(express.static('./public'));
app.get('/', homeHandler);
app.get('/weather', weatherHandler);
app.get('/location', locationHandler);

// Route handler
function homeHandler(req, res) {
    res.status(200).send('Hello World!');
}


function weatherHandler(req, res) {

}

async function locationHandler(req, res) {
    try {
        const search = req.query.search;
        if (search === null || search === undefined || search === '') {
            res.status(400).send('Please enter a valid search query');
            return;
        }
        let url = 'https://us1.locationiq.com/v1/search';
        const locationIQResponse = await superagent.get(url).query({
            key: process.env.LOCATIONIQ_KEY,
            q: search,
            format: "json"
        });
        const locationJson = locationIQResponse.body[0];
        const myLocation = new Location(search, locationJson);

        const restaurantArr = [];

        url = 'https://api.yelp.com/v3/businesses/search';
        const yelpResponse = await superagent.get(url).query({
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
            limit: 12,
            sort_by: 'distance',
            term: 'restaurants'
        }).set('Authorization', `Bearer ${process.env.YELP_KEY}`);

        res.status(200).send(yelpResponse.body.businesses.map(restaurant => new Restaurant(restaurant)));

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong!');
    }

}

// Constructors
function Location(searchQuery, location) {
    this.searchQuery = searchQuery; // This is what the user searched for
    this.formattedQuery = location.display_name; // This is from LocationIQ
    this.latitude = location.lat;
    this.longitude = location.lon;
}

const Restaurant = function (json) {
    this.name = json.name;
    this.rating = json.rating;
    this.image_url = json.image_url;
    this.price = json.price;
    this.url = json.url;
    this.phone = json.display_phone;
    this.categories = json.categories.map(category => category.title);
    this.address = json.location.address1 + (json.location.address2 ? `\n${json.location.address2}` : '');
    this.city = json.location.city;
    this.state = json.location.state;
    this.zip = json.location.zip_code;
}

// App listener
app.listen(port, () => console.log(`Listening on port ${port}`));