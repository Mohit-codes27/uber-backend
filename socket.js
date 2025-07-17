const { Server } = require("socket.io");
const userModel = require("./models/user.model")
const captainModel = require("./models/captain.model")

let io = null; // Will hold the initialized Socket.IO server

// Store active sockets with their socket IDs
const socketUsers = new Map();

/**
 * Initialize the socket.io server
 * @param {http.Server} server - HTTP server instance from createServer
 */
function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*", // ✅ allow all origins
            methods: ["GET", "POST"],
            credentials: false, // ❌ must be false if origin is "*"
        },

    });

    io.on("connection", (socket) => {
        console.log(`✅ New client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`User: ${userId} joined as ${userType}`);
            if (userType === "user") {
                await userModel.findByIdAndUpdate(userId, {
                    socketId: socket.id
                })
            } else if (userType === "captain") {
                await captainModel.findByIdAndUpdate(userId, {
                    socketId: socket.id
                })
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    lng: location.lng,
                    ltd: location.ltd,
                }
            })
        })

        // You can store user info with socket ID if needed
        socketUsers.set(socket.id, socket);

        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
            socketUsers.delete(socket.id);
        });
    });
}

/**
 * Send a message to a specific socket ID
 * @param {string} socketId - The recipient's socket ID
 * @param {string} event - The event name
 * @param {*} data - The message payload
 */
function sendMessageToSocketId(socketId, messageObject) {
    if (io && socketUsers.has(socketId)) {
        socketUsers.get(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.warn(`⚠️ Socket ID ${socketId} not found or Socket.IO not initialized.`);
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
