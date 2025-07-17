const express = require('express');
const router = express.Router();
const {body, query} = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create',
    authMiddleware.authUser,
    body("pickup").isString().isLength({min: 3}).withMessage("Invalid pickup location"),
    body("destination").isString().isLength({min: 3}).withMessage("Invalid destination location"),
    body("vehicleType").isIn(['auto', 'car', 'bike']).withMessage("Invalid vehicle type"),
    rideController.createRide
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage("Invalid ride ID"),
    rideController.confirmRide
);

router.get('/get-fare',
    authMiddleware.authUser,
    query("pickup").isString().isLength({min: 3}).withMessage("Invalid pickup location"),
    query("destination").isString().isLength({min: 3}).withMessage("Invalid destination location"),
    rideController.gerFare
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query("rideId").isMongoId().withMessage("Invalid ride ID"),
    query("otp").isString().isLength({min: 6, max: 6}).withMessage("Invalid OTP"),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body("rideId").isMongoId().withMessage("Invalid ride ID"),
    rideController.endRide
)


module.exports = router;