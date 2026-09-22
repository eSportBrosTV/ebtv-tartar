const { User } = require("../../../models");

module.exports = async (socket, next) => {
    const session = socket.request.session;

    const sessionUserId = session?.passport?.user; 

    if (!sessionUserId) {
        console.log(`[Socket] Connexion refuser : Session passport inexistante`);
        return next(new Error("Session requise"));
    }

    try {
        const user = await User.findById(sessionUserId);
        
        if (!user) {
            console.log(`[Socket] Connexion refuser : Utilisateur introuvable`);
            return next(new Error("Utilisateur invalide"));
        }

        socket.userId = user._id.toString();

        if (session.cookie && session.cookie.expires) {
            const expiryDate = new Date(session.cookie.expires).getTime();
            const timeUntilExpiry = expiryDate - Date.now();

            if (timeUntilExpiry > 0) {
                socket.sessionTimer = setTimeout(() => {
                    console.log(`[Socket] Session expire pour ${socket.userId}`);
                    socket.disconnect(true);
                }, timeUntilExpiry);
            } else {
                console.log(`[Socket] Connexion refuser : Le cookie expiree`);
                return next(new Error("Session expirer"));
            }
        }
        
        next(); 
    } catch (error) {
        console.error(`[Socket] Erreur lors de l'authentification user :`, error);
        return next(new Error("Erreur interne du serveur"));
    }
}