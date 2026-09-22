const { Server } = require('socket.io');
const botSocket = require('../sockets/bots/botSocket');
const panelSocket = require('../sockets/panel/panelSocket');

let io;

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            path: '/socket/',
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        const botNamespace = io.of('/bots');
        const panelNamespace = io.of('/panel')

        botSocket(botNamespace)
        panelSocket(panelNamespace)
        
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