const axios = require('axios');
const captainModel = require('../models/captain.model')

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;

    try {
        const response = await axios.get(url, {
            params: {
                address: address,
                key: apiKey
            }
        });

        if (
            response.data.status === 'OK' &&
            response.data.results &&
            response.data.results.length > 0
        ) {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to find coordinates for the given address');
        }
    } catch (error) {
        throw new Error('Google Maps API request failed');
    }
}

module.exports.getDistanceAndTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    try {
        const response = await axios.get(url, {
            params: {
                origins: origin,
                destinations: destination,
                key: apiKey
            }
        });

        if (response.data.status === 'OK') {
            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No route found between the origin and destination');
            }

            return response.data.rows[0].elements[0];
        }
    } catch (error) {
        throw new Error('Google Maps API request failed', error.message);
    }
}

module.exports.getSuggestions = async (input) => {
    if (!input) {
        throw new Error('Address is required');
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    try {
        const response = await axios.get(url, {
            params: {
                input: input,
                key: apiKey
            }
        });

        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('No suggestions found for the given address');
        }
    } catch (error) {
        throw new Error('Google Maps API request failed', error.message);
    }

}

module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {

    // radius in km

    const captains = await captainModel.find({
    location: {
        $geoWithin: {
            $centerSphere: [[lng, lat], radius / 6371] // radius in radians
        }
    }
});

    console.log(captains)
    return captains;

}