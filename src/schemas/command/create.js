const { z } = require('zod');
const paramDefs = require('./paramDefs');

module.exports =  z.object({
    internalID: z.string(),
    name: z.string(),
    description: z.string().optional(),
    active: z.boolean(),
    paramDefs: paramDefs.optional()
}).strict();