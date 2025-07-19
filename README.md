# Uber Backend API Documentation

This backend powers an Uber-like ride-hailing app. It provides RESTful APIs for user and captain registration, authentication, ride management, and location-based services using Google Maps APIs.

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Google Maps API Key (for geocoding, distance, and autocomplete)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/uber-backend.git
   cd uber-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following:
     ```
     PORT=4000
     MONGODB_URI=mongodb://localhost:27017/uber
     GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     JWT_SECRET=your_jwt_secret
     ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:4000` by default.

---

## Testing the API

You can test the API using [Postman](https://www.postman.com/) or `curl` commands provided in this documentation.

- All endpoints requiring authentication expect a JWT token in the `Authorization` header:  
  `Authorization: Bearer <jwt_token>`

---

## API Endpoints Overview

### Users

- **Register:** `POST /users/register`  
  Register a new user with name, email, and password.

- **Login:** `POST /users/login`  
  Authenticate user and receive JWT token.

- **Profile:** `GET /users/profile`  
  Get authenticated user's profile.

- **Logout:** `GET /users/logout`  
  Logout user and blacklist JWT.

### Captains

- **Register:** `POST /captains/register`  
  Register a new captain with vehicle details.

- **Login:** `POST /captains/login`  
  Authenticate captain and receive JWT token.

- **Profile:** `GET /captains/profile`  
  Get authenticated captain's profile.

- **Logout:** `POST /captains/logout`  
  Logout captain and blacklist JWT.

### Rides

- **Create Ride:** `POST /rides/create`  
  User requests a ride, fare is calculated.

- **Confirm Ride:** `POST /rides/confirm`  
  Captain accepts a ride.

- **Get Fare:** `GET /rides/get-fare`  
  Get fare estimate for a route.

- **Start Ride:** `GET /rides/start-ride`  
  Captain starts ride with OTP.

- **End Ride:** `POST /rides/end-ride`  
  Captain ends the ride.

### Maps

- **Get Coordinates:** `GET /maps/get-coordinates`  
  Get latitude/longitude for an address.

- **Get Distance & Time:** `GET /maps/get-distance-time`  
  Get distance and time between two addresses.

- **Get Suggestions:** `GET /maps/get-suggestions`  
  Get address autocomplete suggestions.

---

## Endpoint Details & Descriptions

### User Endpoints

#### Register User
Registers a new user. Requires first name, email, and password.

#### Login User
Authenticates a user and returns a JWT token.

#### Get User Profile
Returns the profile of the authenticated user.

#### Logout User
Logs out the user and invalidates the JWT token.

---

### Captain Endpoints

#### Register Captain
Registers a new captain (driver) with vehicle details.

#### Captain Login
Authenticates a captain and returns a JWT token.

#### Get Captain Profile
Returns the profile of the authenticated captain.

#### Captain Logout
Logs out the captain and invalidates the JWT token.

---

### Ride Endpoints

#### Create Ride
User requests a ride. Fare and OTP are generated using Google Maps APIs.

#### Confirm Ride
Captain accepts a ride request.

#### Get Fare Estimate
Returns fare estimates for auto, car, and bike based on route.

#### Start Ride
Captain starts the ride using OTP.

#### End Ride
Captain ends the ride and fare is finalized.

---

### Maps Endpoints

#### Get Coordinates
Returns latitude and longitude for a given address.

#### Get Distance and Time
Returns distance and estimated travel time between two addresses.

#### Get Address Suggestions
Returns autocomplete suggestions for addresses.

---

## Notes

- All endpoints require authentication via JWT (`Authorization: Bearer <jwt_token>`).
- Google Maps API key must be set and properly configured.
- Error handling