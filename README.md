# User Registration API

## Endpoint

`POST /users/register`

## Description

Registers a new user in the system. Requires a valid email, a password with at least 6 characters, and a first name with at least 3 characters.

## Request Body

Send a JSON object in the following format:

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

- `fullName.firstName` (string, required, min 3 chars)
- `fullName.lastName` (string, optional)
- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)

## Responses

- **201 Created**
  - User registered successfully.
  - Response body:
    ```json
    {
      "token": "<jwt_token>",
      "user": {
        "_id": "<user_id>",
        "fullName": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **400 Bad Request**
  - Validation failed or missing required fields.
  - Response body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "field",
          "location": "body"
        }
      ]
    }
    ```

## Example

```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```

## Login API

### Endpoint

`POST /users/login`

### Description

Authenticates a user with email and password. Returns a JWT token and user information if credentials are valid.

### Request Body

Send a JSON object in the following format:

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)

### Responses

- **200 OK**
  - Login successful.
  - Response body:
    ```json
    {
      "token": "<jwt_token>",
      "user": {
        "_id": "<user_id>",
        "fullName": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **400 Bad Request**
  - Validation failed or missing required fields.
  - Response body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "field",
          "location": "body"
        }
      ]
    }
    ```

- **401 Unauthorized**
  - Invalid email or password.
  - Response body:
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

### Example

```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```

## Get User Profile

### Endpoint

`GET /users/profile`

### Description

Returns the authenticated user's profile information. Requires a valid JWT token in the `Authorization` header or as a cookie.

### Headers

- `Authorization: Bearer <jwt_token>` (or cookie named `token`)

### Responses

- **200 OK**
  - Returns the user profile.
    ```json
    {
      "user": {
        "_id": "<user_id>",
        "fullName": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **401 Unauthorized**
  - Missing or invalid token.
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### Example

```bash
curl -X GET http://localhost:4000/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Logout User

### Endpoint

`GET /users/logout`

### Description

Logs out the authenticated user by blacklisting the current JWT token and clearing the authentication cookie.

### Headers

- `Authorization: Bearer <jwt_token>` (or cookie named `token`)

### Responses

- **200 OK**
  - Logout successful.
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

- **401 Unauthorized**
  - Missing or invalid token.
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### Example

```bash
curl -X GET http://localhost:4000/users/logout \
  -H "Authorization: Bearer <jwt_token>"
```

# Captain API Documentation

## Register Captain

### Endpoint

`POST /captains/register`

### Description

Registers a new captain (driver) with vehicle information. Requires a valid email, password, first name, and vehicle details.

### Request Body

Send a JSON object in the following format:

```json
{
  "fullName": {
    "firstName": "Jane",
    "lastName": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

- `fullName.firstName` (string, required, min 3 chars)
- `fullName.lastName` (string, optional)
- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)
- `vehicle.color` (string, required, min 3 chars)
- `vehicle.plate` (string, required, min 3 chars, unique)
- `vehicle.capacity` (integer, required, min 1)
- `vehicle.vehicleType` (string, required, one of: `car`, `motorcycle`, `auto`)

### Responses

- **201 Created**
  - Captain registered successfully.
  - Response body:
    ```json
    {
      "token": "<jwt_token>",
      "captain": {
        "_id": "<captain_id>",
        "fullName": {
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "email": "jane.smith@example.com",
        "vehicle": {
          "color": "Red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "car"
        }
      }
    }
    ```

- **400 Bad Request**
  - Validation failed, missing required fields, or captain already exists.
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "field",
          "location": "body"
        }
      ]
    }
    ```
    or
    ```json
    {
      "message": "Captain already exists"
    }
    ```

### Example

```bash
curl -X POST http://localhost:4000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": { "firstName": "Jane", "lastName": "Smith" },
    "email": "jane.smith@example.com",
    "password": "yourpassword",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

## Captain Login

### Endpoint

`POST /captains/login`

### Description

Authenticates a captain with email and password. Returns a JWT token and captain information if credentials are valid.

### Request Body

```json
{
  "email": "jane.smith@example.com",
  "password": "yourpassword"
}
```

- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)

### Responses

- **200 OK**
  - Login successful.
    ```json
    {
      "token": "<jwt_token>",
      "captain": {
        "_id": "<captain_id>",
        "fullName": {
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "email": "jane.smith@example.com",
        "vehicle": {
          "color": "Red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "car"
        }
      }
    }
    ```

- **400 Bad Request**
  - Validation failed or missing required fields.
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "field",
          "location": "body"
        }
      ]
    }
    ```

- **401 Unauthorized**
  - Invalid email or password.
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

### Example

```bash
curl -X POST http://localhost:4000/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "yourpassword"
  }'
```

---

## Get Captain Profile

### Endpoint

`GET /captains/profile`

### Description

Returns the authenticated captain's profile information. Requires a valid JWT token in the `Authorization` header or as a cookie.

### Headers

- `Authorization: Bearer <jwt_token>` (or cookie named `token`)

### Responses

- **200 OK**
  - Returns the captain profile.
    ```json
    {
      "captain": {
        "_id": "<captain_id>",
        "fullName": {
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "email": "jane.smith@example.com",
        "vehicle": {
          "color": "Red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "car"
        }
      }
    }
    ```

- **401 Unauthorized**
  - Missing or invalid token.
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### Example

```bash
curl -X GET http://localhost:4000/captains/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Captain Logout

### Endpoint

`POST /captains/logout`

### Description

Logs out the authenticated captain by blacklisting the current JWT token and clearing the authentication cookie.

### Headers

- `Authorization: Bearer <jwt_token>` (or cookie named `token`)

### Responses

- **200 OK**
  - Logout successful.
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

- **401 Unauthorized**
  - Missing or invalid token.
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### Example

```bash
curl -X POST http://localhost:4000/captains/logout \
  -H "Authorization: Bearer <jwt_token>"
```

# Backend API Reference

This document describes the main endpoints, request/response formats, and related models/controllers for the ride and maps features.

---

## Ride Endpoints

### Create Ride

**Endpoint:**  
`POST /rides/create`

**Description:**  
Creates a new ride request. Calculates fare and OTP using Google Maps APIs.

**Headers:**  
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "pickup": "123 Main St, City",
  "destination": "456 Elm St, City",
  "vehicleType": "car"
}
```
- `pickup` (string, required): Pickup address.
- `destination` (string, required): Destination address.
- `vehicleType` (string, required): One of `auto`, `car`, `bike`.

**Success Response:**
- **201 Created**
```json
{
  "ride": {
    "_id": "<ride_id>",
    "userId": "<user_id>",
    "pickup": "123 Main St, City",
    "destination": "456 Elm St, City",
    "vehicleType": "car",
    "fare": 120,
    "otp": "1234",
    "status": "pending",
    "distance": 5400,
    "duration": 900
  }
}
```

**Error Responses:**
- **400 Bad Request**
```json
{
  "errors": [
    {
      "msg": "Invalid pickup location",
      "param": "pickup",
      "location": "body"
    }
  ]
}
```
- **401 Unauthorized**
```json
{
  "message": "Unauthorized"
}
```

---

## Get Fare Estimate

**Endpoint:**  
`GET /rides/get-fare`

**Description:**  
Returns fare estimates for `auto`, `car`, and `bike` based on the distance and time calculated using Google Maps APIs.

**Headers:**  
- `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `pickup` (string, required): Pickup address.  
- `destination` (string, required): Destination address.

**Success Response:**
- **200 OK**
```json
{
  "auto": 72.5,
  "car": 120,
  "bike": 58.3
}

```

**Error Responses:**
- **400 Bad Request**
```json
{
  "errors": [
    {
      "msg": "Invalid pickup location",
      "param": "pickup",
      "location": "query"
    },
    {
      "msg": "Invalid destination location",
      "param": "destination",
      "location": "query"
    }
  ]
}

```
- **500 Unauthorized**
```json
{
  "error": "Pickup and destination are required to calculate fare"
}
```

---

## Maps Endpoints

### Get Coordinates

**Endpoint:**  
`GET /maps/get-coordinates?address=123 Main St, City`

**Description:**  
Returns the latitude and longitude for a given address.

**Headers:**  
- `Authorization: Bearer <jwt_token>`

**Success Response:**
- **200 OK**
```json
{
  "ltd": 28.6139,
  "lang": 77.2090
}
```

**Error Responses:**
- **400 Bad Request**
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "address",
      "location": "query"
    }
  ]
}
```
- **500 Internal Server Error**
```json
{
  "error": "Unable to find coordinates for the given address"
}
```

---

### Get Distance and Time

**Endpoint:**  
`GET /maps/get-distance-time?origin=123 Main St, City&destination=456 Elm St, City`

**Description:**  
Returns the distance and estimated travel time between two addresses.

**Headers:**  
- `Authorization: Bearer <jwt_token>`

**Success Response:**
- **200 OK**
```json
{
  "distance": {
    "text": "5.4 km",
    "value": 5400
  },
  "duration": {
    "text": "15 mins",
    "value": 900
  }
}
```

**Error Responses:**
- **400 Bad Request**
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "origin",
      "location": "query"
    }
  ]
}
```
- **500 Internal Server Error**
```json
{
  "error": "No route found between the origin and destination"
}
```

---

### Get Address Suggestions

**Endpoint:**  
`GET /maps/get-suggestions?input=Main`

**Description:**  
Returns autocomplete suggestions for addresses.

**Headers:**  
- `Authorization: Bearer <jwt_token>`

**Success Response:**
- **200 OK**
```json
{
  "suggestions": [
    {
      "description": "123 Main St, City, Country",
      "place_id": "abcdef123456"
    },
    {
      "description": "124 Main St, City, Country",
      "place_id": "abcdef654321"
    }
  ]
}
```

**Error Responses:**
- **400 Bad Request**
```json
{
  "error": "Input is required"
}
```
- **500 Internal Server Error**
```json
{
  "error": "No suggestions found for the given address"
}
```

---

## Models

### Ride Model (`ride.model.js`)
- `userId`: ObjectId (User)
- `captain`: ObjectId (Captain)
- `pickup`: String
- `destination`: String
- `vehicleType`: String
- `fare`: Number
- `otp`: String
- `status`: String (pending, accepted, in-progress, completed, cancelled)
- `distance`: Number (meters)
- `duration`: Number (seconds)

---

## Controllers

### `ride.controller.js`
- **createRide**: Handles ride creation, calls `rideService.createRide`, returns ride or error.

### `map.controller.js`
- **getCoordinates**: Returns coordinates for an address.
- **getDistanceAndTime**: Returns distance and duration between two addresses.
- **getSuggestions**: Returns address suggestions.

---

## Services

### `ride.service.js`
- **createRide**: Validates input, calculates fare and OTP, creates ride.
- **getFare**: Uses Google Maps API to calculate fare based on distance/time.

### `maps.service.js`
- **getAddressCoordinate**: Calls Google Geocoding API.
- **getDistanceAndTime**: Calls Google Distance Matrix API.
- **getSuggestions**: Calls Google Places Autocomplete API.

---

## Notes

- All endpoints require authentication via JWT (`Authorization: Bearer <jwt_token>`).
- Google Maps API key must be set and properly configured.
- Error handling