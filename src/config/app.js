const express = require('express');
const cors = require('cors');
const session = require('express-session')

const { default: MongoStore } = require('connect-mongo');
const passport = require('passport');

const healthRouter = require('../routes/health/health.routes');

const routes = require('../routes');

const { isHealthyConnect, errorHandler } = require('../middlewares');

const app = express();

require('./passport')

app.use(express.json())

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use('/health', healthRouter)
app.use(isHealthyConnect)

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_LINK,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
        secure: process.env.ENVEX === 'prod'
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.use(errorHandler)

module.exports = app;