const sessionMiddleware = require("../../config/session")
const { handleDisconnect } = require("./controllers/connectEventCtrl")
const panelAuthSocket = require("./middlewares/panelAuthSocket")
const verifSession = require("./middlewares/verifSession")
const isHealthConnect = require("../common/middlewares/isHealthConnect")

module.exports = (io) => {
    io.use(isHealthConnect)

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res || {}, next)
    })

    io.use(panelAuthSocket)

    io.on("connection", (socket) => {
        console.log(`[Socket] Utilisateur connecter : ${socket.userId}`)

        socket.join(socket.userId)
        socket.join(socket.request.session.id)

        socket.use(verifSession(socket))

        socket.on("disconnect", (reason) => handleDisconnect(socket, reason))
    })
}
