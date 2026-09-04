const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_LINK, {});
        console.log(`[MongoDB] Connexion DB reussi`)

    } catch (error) {
        console.error(`[MongoDB] Erreur de connexion db : ${error.message}`);
        process.exit(1); 
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('[MongoDB] déconnecter');
});

mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] reconnecter');
});

module.exports = {
    connectDB
};