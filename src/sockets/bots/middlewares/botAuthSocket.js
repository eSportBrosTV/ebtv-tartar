module.exports = async (socket, next) => {
    const auth = socket.handshake.auth;

    if (!auth || !auth.orcaId) {
      console.log(
        `[Socket] Connexion refuser : ID d'organisation manquant.`
      );
      return next(new Error("Authentification echouee : orgId requis"));
    }
    socket.orcaId = auth.orcaId;
    next(); 
}