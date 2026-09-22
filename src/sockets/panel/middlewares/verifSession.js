module.exports = (socket) => (event, next) => {
    socket.request.session.reload((err) => {
        if(err || !socket.request.session.passport?.user){
            console.log(`[Socket] Session invalide pour ${socket.userId}`)
            socket.disconnect(true)
            return next(new Error("Session invalide"))
        }

        next()
    })
}