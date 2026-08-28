const { z } = require('zod');

module.exports =  z.object({
    orga: z.string(),
    token: z.string(),
    serv: z.string(),
    logChannel: z.string(),
    requireFirstDeploy: z.string().optional()
});