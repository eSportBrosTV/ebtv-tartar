const { z } = require('zod');
const paramDefs = require('./paramDefs');

module.exports =  z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    active: z.boolean().optional(),
    paramDefs: paramDefs.optional()
}).strict().refine((data) => Object.keys(data).length > 0);