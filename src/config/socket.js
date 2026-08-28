const { Server } = require('socket.io');
const botSocket = require('../sockets/bots/botSocket');

let io;

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            path: '/socket/',
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        const botNamespace = io.of('/bots');
        botSocket(botNamespace)
        
        console.log("[Socket] Serveur Socket.IO initialise");
        return io;
    },

    /**
     * 
     * @returns {Server}
     */
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io n'es pas initialiser");
        }
        return io;
    }
};