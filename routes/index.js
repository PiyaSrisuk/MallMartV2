const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    console.log('Get | Register');
    res.render('signPages/register.ejs')
})

router.post('/register', (req, res) => {
    console.log('Post | Register');
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            console.log('Registing success')
            res.redirect('/user/home');
        });
    });
})

router.get('/login', (req, res) => {
    console.log('Get | Login');
    res.render('signPages/login.ejs')
})

router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/checkAdmin',
        failureRedirect: '/login'
    }), function (res, res) {
        console.log('test')
});

router.get('/checkAdmin', (req, res) => {
    if(req.user.isAdmin) {
        console.log('is admin');
        res.redirect('/admin/home');
    } else {
        console.log('is user');
        res.redirect('/user/home');
    }
})

// log out
router.get('/logout', function (req, res) {
    req.logout();
    console.log('logout success')
    res.redirect('/user/home');
});

module.exports = router;