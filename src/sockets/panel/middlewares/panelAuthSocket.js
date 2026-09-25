const { userService } = require("../../../services");

module.exports = async (socket, next) => {
    const session = socket.request.session;

    const sessionUserId = session?.passport?.user;

    if (!sessionUserId) {
        console.log(`[Socket] Connexion refuser : Session passport inexistante`);
        return next(new Error("Session requise"));
    }

    try {
        const user = await userService.auth.validateSession(sessionUserId, session.sessionVersion);

        socket.userId = user._id.toString();
    } catch (error) {
        console.log(`[Socket] Connexion refuser : ${error.message}`);
        return next(new Error("Session invalide"));
    }

    if (session.cookie && session.cookie.expires) {
        const expiryDate = new Date(session.cookie.expires).getTime();
        const timeUntilExpiry = expiryDate - Date.now();

        if (timeUntilExpiry <= 0) {
            console.log(`[Socket] Connexion refuser : Le cookie expiree`);
            return next(new Error("Session expirer"));
        }

        socket.sessionTimer = setTimeout(() => {
            console.log(`[Socket] Session expire pour ${socket.userId}`);
            socket.disconnect(true);
        }, timeUntilExpiry);
    }

    next();
}
