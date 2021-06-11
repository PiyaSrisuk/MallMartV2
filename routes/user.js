const router = require('express').Router();
const Product = require('../models/product.js');
const Category = require('../models/category.js');
let bufferProduct;

// Default home
router.get('/home', (req, res) => {
    console.log('Get | User show Product');
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            Product.find({}).sort({ createdAt: -1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    bufferProduct = allProduct;
                    res.render('userPages/home.ejs', { product: allProduct , category: allCategory});
                }
            });
        }
    })
})

// Home sort by
router.get('/home/sortby/:option', (req, res) => {
    console.log('Get | User home Sort by');
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory) {
        if (err) {
            console.log(err);
        }
        else if (req.params.option === 'newest') {
            Product.find({}).sort({ createdAt: -1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('userPages/home.ejs', { product: allProduct, category: allCategory });
                }
            })
        }
        else if (req.params.option === 'oldest') {
            Product.find({}).sort({ createdAt: 1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('userPages/home.ejs', { product: allProduct, category: allCategory });
                }
            });
        }
        else if (req.params.option === 'pricelowtohigh') {
            Product.find({}).sort({ price: 1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('userPages/home.ejs', { product: allProduct, category: allCategory });
                }
            });
        }
        else if (req.params.option === 'pricehightolow') {
            Product.find({}).sort({ price: -1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('userPages/home.ejs', { product: allProduct, category: allCategory });
                }
            });
        }
        else {
            Product.find({}, (function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('userPages/home.ejs', { product: allProduct, category: allCategory });
                }
            }));
        }
    })
})

// Home filter +++
router.get('/home/filter/:option', (req, res) => {
    console.log('Get | Admin home Filter');

})

// Home search
router.post('/home/search', (req, res) => {
    console.log('Get | User home Search');
    const key = req.body.key;
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            Product.find({name: { $regex: '.*' + key + '.*' }}).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    bufferProduct = allProduct;                   
                    res.render('userPages/home.ejs', { product: bufferProduct, category: allCategory });
                }
            });
        }
    })
})

// Home by Category page
router.get('/home/category/:title', (req, res) => {
    console.log('Get | User Home by Category');
    const category = req.params.title.toLowerCase();
    Category.find({}, (function (err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            Product.find({category: category}, (function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('userPages/home.ejs', { category: allCategory, product: allProduct });
                }
            }))
        }  
    }))  
})

router.get('/home/product/:id', (req, res) => {
    console.log('Get | User Product');
    Product.findById({_id: req.params.id}, (function (err, product){
        if (err) {
            console.log(err);
        } else {
            res.render('userPages/product.ejs', { product: product});
        }
    }))
})

router.post('/cart/add/:id', isLoggedIn, (req, res) => {
    console.log('Get | User Cart Add');
    console.log(req.params.id)
    console.log(req.user.cart)
    req.user.cart.push({_id: req.params.id});
})


// check log in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;