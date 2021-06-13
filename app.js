// import from
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session'); 
const flash = require('connect-flash');

// import from
const config = require('./config');
const seedDB = require('./seeds');
const User = require('./models/user');

// connect to MongoDB
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    try {
        console.log('Connect to MongoDB')
    } catch (err) {
        console.error
    }
});
seedDB();

// use
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

// Passport
app.use(session({
    secret: 'secret is always secret.',
    resave: false,
    saveUninitialized: true,
  }))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
 });

// set and use route
const index = require('./routes/index.js');
const user = require('./routes/user.js');
const admin = require('./routes/admin.js');

app.use('/admin', admin);
app.use('/user', user);
app.use('/', index);
app.use('*', (req, res) => {
    res.redirect('user/home');
});

// run server
app.listen(config.port, () => {
    console.log('App starting at port ' + config.port);
})