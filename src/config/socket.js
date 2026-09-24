const { Server } = require('socket.io');
const corsOptions = require('./cors');

let io;

module.exports = {
    init: (httpServer) => {
        const botSocket = require('../sockets/bots/botSocket');
        const panelSocket = require('../sockets/panel/panelSocket');

        io = new Server(httpServer, {
            path: '/socket/',
            cors: {
                ...corsOptions,
                methods: ["GET", "POST"]
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