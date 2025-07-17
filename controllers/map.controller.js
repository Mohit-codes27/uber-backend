const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    try {
        const coordinates = await mapsService.getAddressCoordinate(address);
        return res.status(200).json(coordinates);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports.getDistanceAndTime = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const distanceAndTime = await mapsService.getDistanceAndTime(origin, destination);
        return res.status(200).json(distanceAndTime);
    }catch(error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports.getSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;
    
        if (!input) {
            return res.status(400).json({ error: 'Input is required' });
        }
    
        // This function is not implemented in the provided service, so we will return a placeholder response.
        // You can implement the actual logic in the maps.service.js file.
        const suggestions = await mapsService.getSuggestions(input);
        if (suggestions && suggestions.length > 0) {
            return res.status(200).json({ suggestions });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
        
    }
}