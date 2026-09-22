const handleDiconnect = (socket, reason) => {
    if(socket.sessionTimer){
        clearTimeout(socket.sessionTimer)
    }

    console.log(`[Socket] Deco de l'user ${socket.userId} : ${reason}`)
}

module.exports = {
    handleDiconnect
}