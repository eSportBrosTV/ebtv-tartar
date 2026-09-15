const { z } = require('zod');

module.exports =  z.object({
    command_id: z.string(),
    active: z.boolean(),
    params: z.any().optional()
}).strict();