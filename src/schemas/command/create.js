const { z } = require('zod');

module.exports =  z.object({
    internalID: z.string(),
    name: z.string(),
    description: z.string().optional(),
    active: z.boolean(),
    params: z.any().optional()
}).strict();