const { z } = require('zod');

module.exports = z.object({
    user: z.string(),
    role: z.enum(["owner", "member"]).optional()
}).strict();