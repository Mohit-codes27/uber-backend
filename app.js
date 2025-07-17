const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectToDB = require("./db/db")
const userRoutes = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const captainRoutes = require("./routes/captain.route");
const mapsRoutes = require("./routes/maps.route");
const rideRoutes = require("./routes/ride.route");

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.get('/', (req,res)=>{
    res.send('Hello World!');
})
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);

module.exports = app