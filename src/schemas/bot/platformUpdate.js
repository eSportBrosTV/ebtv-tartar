const { z } = require('zod');

module.exports =  z.object({
    platformId: z.string().nullable(),
    params: z.record(z.string(), z.unknown()).default({})
}).strict();
