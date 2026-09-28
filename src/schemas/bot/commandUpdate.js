const { z } = require('zod');

module.exports =  z.object({
    active: z.boolean().optional(),
    params: z.record(z.string(), z.unknown()).optional()
}).strict().refine((data) => Object.keys(data).length > 0);