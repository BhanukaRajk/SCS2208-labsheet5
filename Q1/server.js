const express = require('express');
const session = require('express-session');
const path = require('path');
const members = require('./members.js');

const passport = require('passport');
const passport_local = require('passport-local');

const app = express();
const port = 3002;
var Attempts = 0;

app.use(express.static(path.join( __dirname, '/public' )));
app.use(express.static(path.join( __dirname, '/images' )));


const LocalStrategy = new passport_local.Strategy({
    usernameField: 'email'
},
    (email, password, done) => {
        const user = members.users.find((user) => user.email === email);
        if (!user) {
            return done(null, false);
        } else {
            if (user.password !== password) {
                return done(null, false);
            } else {
                Attempts = Attempts + 1;
                return done(null, user.email);
            }
        }
    }
);

passport.use(LocalStrategy);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (email, done) {
    done(null, email);
});

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(
    session({
        secret: 'u7s98d#4324x$C432!$1fscs%&2x4345c4v634$123',
        cookie: {
            maxAge:64*64*128,
            httpOnly:false,
            secure: false,
        },
        saveUninitialized: true,
        resave: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log(req.session);
    res.render('home', {
        count: Attempts,
    });

});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
    }),
    (req, res) => {
});

app.post('/logout', (req, res) => {
    req.logout(() => {
    res.redirect('/login')});
});

app.listen(port, () => {
    console.log('Server started to listen port', port);
});