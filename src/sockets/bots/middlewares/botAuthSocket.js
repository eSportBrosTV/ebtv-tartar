const jwt = require("jsonwebtoken")

module.exports = async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log(
        `[Socket] Connexion refuser : Token manquant.`
      );
      return next(new Error("Authentification echouee : Token requis"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.orcaId = decoded.orca_id
    } catch (error) {
      return next(new Error("Acces refuse : Token corrompu ou invalide"));
    }
    
    next(); 
}