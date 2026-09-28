module.exports = (zodError) => zodError.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
}));
