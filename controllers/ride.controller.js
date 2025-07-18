const rideService = require('../services/ride.service');
const mapService = require('../services/maps.service')
const {validationResult} = require('express-validator');
const {sendMessageToSocketId} = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({
            userId: req.user._id,
            pickup,
            destination,
            vehicleType
        });
        
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup)
        
        // console.log(pickupCoordinates)
        
        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2)

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({_id: ride._id}).populate('userId')
        
        captainsInRadius.map( captain=>{
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })
        })
        res.status(201).json({ ride });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports.gerFare = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const { pickup, destination } = req.query;

        try{
            const fare = await rideService.getFare(pickup, destination)
            return res.status(200).json(fare)
        }catch(err){
            return res.status(500).json({error:err.message})
        }
}

module.exports.confirmRide = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const {rideId} = req.body;

        try{
            const ride = await rideService.confirmRide({ rideId, captain: req.captain._id })
            sendMessageToSocketId(ride.userId.socketId, {
                event: 'ride-confirmed',
                data: ride
            })

            return res.status(200).json(ride)
        }catch(err){
            return res.status(500).json({error:err.message})
        }
}

module.exports.startRide = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {rideId, otp} = req.query;
    try{
        const ride = await rideService.startRide({rideId, otp, captain: req.captain._id})
        sendMessageToSocketId(ride.userId.socketId, {
            event: 'ride-started',
            data: ride
        })
        return res.status(200).json(ride)
    } catch(err){
        return res.status(500).json({error:err.message})
    }
}

module.exports.endRide = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    const {rideId} = req.body;
    try{
        const ride = await rideService.endRide({rideId, captain: req.captain._id})
        sendMessageToSocketId(ride.userId.socketId, {
            event: 'ride-ended',
            data: ride
        })

        

        return res.status(200).json(ride)
    } catch(err){
        return res.status(500).json({error:err.message})
    }
}