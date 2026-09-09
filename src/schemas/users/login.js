const { z } = require('zod');

module.exports = z.object({
    username: z.string(),
    password: z.string()
}).strict();