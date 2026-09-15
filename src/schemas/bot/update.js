const { z } = require('zod');

module.exports =  z.object({
    token: z.string().optional(),
    serv: z.string().optional(),
    logChannel: z.string().optional(),
}).strict().refine((data) => Object.keys(data).length > 0);