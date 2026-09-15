const { z } = require('zod');

const updateUser = z.object({
    username: z.string().optional(),
    password: z.string().optional()
}).strict().refine((data) => Object.keys(data).length > 0)

const updateAdmin = z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    roles: z.enum(["user", "admin"]).optional()
}).strict().refine((data) => Object.keys(data).length > 0)

module.exports = {
    updateUser,
    updateAdmin
}