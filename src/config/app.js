const express = require('express');
const cors = require('cors');
const session = require('express-session')

const { default: MongoStore } = require('connect-mongo');
const passport = require('passport');

const healthRouter = require('../routes/health/health.routes');

const routes = require('../routes');

const { isHealthyConnect, errorHandler } = require('../middlewares');
const sessionMiddleware = require('./session');
const corsOptions = require('./cors');

const app = express();

require('./passport')

if (process.env.ENVEX === 'prod') {
    app.set('trust proxy', 1)
}

app.use(express.json())

app.use(cors(corsOptions))

app.use('/health', healthRouter)
app.use(isHealthyConnect)

app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.use(errorHandler)

module.exports = app;