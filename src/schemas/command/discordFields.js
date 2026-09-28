const { z } = require('zod');

const name = z.string().regex(
    /^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]{1,32}$/u,
    "Nom de commande Discord invalide (1 a 32 caracteres, minuscules, sans espace)"
);

const description = z.string().min(1).max(100);

module.exports = {
    name,
    description
};
