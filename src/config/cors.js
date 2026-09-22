const allowedOrigins = (process.env.PANEL_ORIGIN || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean)

const corsOptions = {
    origin: allowedOrigins,
    credentials: true
}

module.exports = corsOptions
