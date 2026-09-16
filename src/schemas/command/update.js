const { z } = require('zod');

module.exports =  z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    active: z.boolean().optional(),
    params: z.any().optional()
}).strict().refine((data) => Object.keys(data).length > 0);