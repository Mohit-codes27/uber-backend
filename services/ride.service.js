const { log } = require('console');
const rideModel = require('../models/ride.model');
const mapsService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required to calculate fare');
    }

    const distanceTime = await mapsService.getDistanceAndTime(pickup, destination);
    

    const baseFare = {
        auto: 30,   // ₹12 per km
        car: 50,    // ₹18 per km
        bike: 20     // ₹8 per km
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        bike: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        bike: 1
    };

    const fare = {
        auto: Math.round(baseFare.auto +
            ((distanceTime.distance.value / 1000) * perKmRate.auto) +
            ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car +
            ((distanceTime.distance.value / 1000) * perKmRate.car) +
            ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        bike: Math.round(baseFare.bike +
            ((distanceTime.distance.value / 1000) * perKmRate.bike) +
            ((distanceTime.duration.value / 60) * perMinuteRate.bike))
    }

    return fare;
}

module.exports.getFare = getFare

function getOtp(num) {
    function generateOtp(num){
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return otp;
    }
    return generateOtp(num);
}

module.exports.createRide = async ({
    userId,
    pickup,
    destination,
    vehicleType
 }) => {
    if(!userId, !pickup, !destination, !vehicleType) {
        throw new Error("All fields are required");
    }

    const fare = await getFare(pickup, destination)

    const ride = rideModel.create({
        userId,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType],
    })

    return ride;

}

module.exports.confirmRide = async({rideId, captain}) =>{
    if(!rideId){
        throw new Error("Ride id is required");
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain
    })

    const ride = await rideModel.findOne({ _id: rideId }).populate('userId').populate('captain').select("+otp");

    if(!ride){
        throw new Error("Ride not found");
    }
    console.log(ride)
    return ride;
}

module.exports.startRide = async({rideId, otp, captain}) => {
    if(!rideId || !otp || !captain) {
        throw new Error("Ride id, otp and captain are required");
    }

    const ride = await rideModel.findOne({_id: rideId }).populate('userId').populate('captain').select("+otp");

    if(!ride) {
        throw new Error("Ride not found");
    }

    if(ride.status !== 'accepted') {
        throw new Error("Ride is not accepted");
    }

    if(ride.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'in-progress' }
    );

    sendMessageToSocketId(ride.userId.socketId, {
        event: 'ride-started',
        data: ride
    });
    return ride;
}

module.exports.endRide = async({rideId, captain}) => {
    if(!rideId || !captain) {
        throw new Error("Ride id and captain are required");
    }

    const ride = await rideModel.findOne({_id: rideId, captain: captain }).populate('userId').populate('captain');
    if(!ride) {
        throw new Error("Ride not found");
    }
    if(ride.status !== 'in-progress') {
        throw new Error("Ride is not in progress");
    }
    await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'completed' }
    );
    return ride;
}

