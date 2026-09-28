const { z } = require('zod');
const paramDefs = require('./paramDefs');
const { name, description } = require('./discordFields');

module.exports =  z.object({
    name: name.optional(),
    description: description.optional(),
    active: z.boolean().optional(),
    paramDefs: paramDefs.optional()
}).strict().refine((data) => Object.keys(data).length > 0);