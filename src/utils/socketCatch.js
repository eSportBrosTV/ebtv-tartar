const socketCatch = (fn) => {
    return (socket, ...args) => {
        Promise.resolve(fn(socket, ...args)).catch((err) => {
            console.error(`[Socket] Erreur sur le socket ${socket.id} :`, err.message);
        });
    };
};

module.exports = socketCatch;
