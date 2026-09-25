const { botService } = require("../../../services");

module.exports = async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log(
        `[Socket] Connexion refuser : Token manquant.`
      );
      return next(new Error("Authentification echouee : Token requis"));
    }

    try {
      socket.orcaId = await botService.auth.verifyToken(token)
    } catch (error) {
      console.log(`[Socket] Connexion refuser : ${error.message}`);
      return next(new Error("Acces refuse : Token corrompu ou invalide"));
    }

    next();
}
