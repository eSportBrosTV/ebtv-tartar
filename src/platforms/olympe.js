const { z } = require('zod');

module.exports = {
    id: 'olympe',
    name: 'Olympe',
    description: "Plateformes de tournois OlympeLegends",
    schema: z.object({
        domain: z.hostname().meta({
            title: "Domaine de l'instance",
            description: "Ex : splatoon-euro-leagues.olympelegends.com"
        }),
        challengeId: z.int().positive().meta({
            title: "ID du challenge"
        }),
        token: z.string().min(1).optional().meta({
            title: "Token d'acces personnel",
            description: "Facultatif, necessaire pour ecrire sur Olympe",
            secret: true
        })
    }).strict()
};
