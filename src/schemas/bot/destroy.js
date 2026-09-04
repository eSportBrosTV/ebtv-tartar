const { z } = require('zod');

module.exports =  z.object({
    force: z.boolean().optional().default(false)
}).strict().default({});