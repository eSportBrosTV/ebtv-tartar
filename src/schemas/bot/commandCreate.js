const { z } = require('zod');

module.exports =  z.object({
    bot_id: z.string(),
    command_id: z.string(),
    active: z.boolean(),
    params: z.any().optional()
}).strict();