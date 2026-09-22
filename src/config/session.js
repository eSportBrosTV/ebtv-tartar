const { default: MongoStore } = require("connect-mongo");
const session = require("express-session");

const sessionMiddleware = session({
    secret: process.env.SESSION_KEY,
    
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.DB_LINK,
        collectionName: 'sessions'
    }),

    cookie: {
        httpOnly: true,
        secure: process.env.ENVEX === 'prod',
        maxAge: 1000*60*60*24*7
    }
})

module.exports = sessionMiddleware