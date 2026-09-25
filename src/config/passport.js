const passport = require('passport')
const LocalStartegy = require('passport-local').Strategy
const { userService } = require('../services')
const ErrorCodes = require('../utils/errors/ErrorCodes')


const strat = new LocalStartegy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await userService.auth.authenticate(username, password)

        return done(null, user)
    } catch (err) {
        if (err.code === ErrorCodes.UNAUTHORIZED) {
            return done(null, false, { message: 'Pseudo ou mot de passe incorrect' });
        }

        return done(err)
    }
})

passport.use(strat)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userService.manage.getById(id);
        done(null, user);
    } catch (err) {
        if (err.code === ErrorCodes.NOT_FOUND) return done(null, false);

        done(err);
    }
});
