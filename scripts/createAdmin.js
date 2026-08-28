require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const { User } = require('../src/models'); 

const seedSuperAdmin = async () => {
    const rl = readline.createInterface({ input, output });

    try {
        console.log("[AdminCreator] Creation du premier compte admin\n");
        const adminUsername = await rl.question("[AdminCreator] Username : ");
        const adminPassword = await rl.question("[AdminCreator] Password : ");

        if (!adminUsername || !adminPassword) {
            console.log("\n[AdminCreator] Erreur : Tous les champs sont obligatoire");
            process.exit(1);
        }

        await mongoose.connect(process.env.DB_LINK);
        console.log("\n[AdminCreator] Connecter a la db");

        const existingAdmin = await User.findOne({username: adminUsername});
        
        if (existingAdmin) {
            console.log("[AdminCreator] Un compte admin existe deja");
            process.exit(0);
        }

        await User.create({
            username: adminUsername,
            password: adminPassword,
            roles: "admin"
        });

        console.log("\n[AdminCreator] Compte SuperAdmin creer");
        console.log(`[AdminCreator] Username : ${adminUsername}`);
        console.log(`[AdminCreator] Password : ${adminPassword}`);
        
    } catch (error) {
        console.error("\n[AdminCreator] Erreur lors de la creation du compte :", error);
        process.exit(1);
    } finally {
        rl.close();
        await mongoose.disconnect();
        process.exit(0);
    }
};

seedSuperAdmin();