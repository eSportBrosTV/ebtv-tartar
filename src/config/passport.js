const passport = require('passport')
const { User } = require('../models')
const LocalStartegy = require('passport-local').Strategy


const strat = new LocalStartegy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    const user = await User.findOne({username: username}).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return done(null, false, { message: 'Pseudo ou mot de passe incorrect' });
    }

    return done(null, user)
})

passport.use(strat)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});