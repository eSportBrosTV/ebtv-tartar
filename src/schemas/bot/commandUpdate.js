const { z } = require('zod');

module.exports =  z.object({
    active: z.boolean().optional(),
    params: z.any().optional()
}).strict().refine((data) => Object.keys(data).length > 0);