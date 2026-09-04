const express = require('express');
const cors = require('cors');
const session = require('express-session')

//import des route
const orgaRouter = require('../routes/orga');
const commandsRouter = require('../routes/commands');
const errorHadler = require('../middlewares/errorHadler');
const botRouter = require('../routes/bot');
const { default: MongoStore } = require('connect-mongo');
const passport = require('passport');
const authRouter = require('../routes/auth');

const app = express();

require('./passport')

app.use(express.json())

app.use(cors({
    origin: '*',
    credentials: true
}))

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

app.use('/orga', orgaRouter)
app.use('/commands', commandsRouter)
app.use('/bot', botRouter)
app.use('/auth', authRouter)

app.use(errorHadler)

module.exports = app;