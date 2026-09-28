const { z } = require('zod');
const paramDefs = require('./paramDefs');
const { name, description } = require('./discordFields');

module.exports =  z.object({
    internalID: z.string(),
    name,
    description: description.optional(),
    active: z.boolean(),
    paramDefs: paramDefs.optional()
}).strict();