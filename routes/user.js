const router = require('express').Router();
const Product = require('../models/product.js');
const Category = require('../models/category.js');
const User = require('../models/user.js');
const Record = require('../models/record.js');

// current option
let curCategory = {};
let curFilter = {};
let curSortby = { createdAt: -1 };

let displayCategory = 'all';
let displayFilter = 'all';
let displaySortby = 'newest';

// default home
router.get('/home', (req, res) => {
    console.log('Get | User home');
    Category.find({}).sort({ title: 1 }).exec(function (err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            let curCategoryFilter = { ...curCategory, ...curFilter };
            // console.log(curCategoryFilter)
            Product.find(curCategoryFilter).sort(curSortby).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('userPages/home.ejs', { product: allProduct, category: allCategory, 
                        displayCategory: displayCategory, displayFilter: displayFilter, displaySortby: displaySortby });
                }
            });
        }
    })
})

// Home by Category page
router.get('/home/category/:title', (req, res) => {
    console.log('Get | User Home by Category');
    let category = req.params.title.toLowerCase();
    if (category === 'all') {
        curCategory = {};
        displayCategory = 'all';
    } else {
        curCategory = { category: category };
        displayCategory = category.toString();
    }
    res.redirect('/user/home');
})

// Home filter
router.get('/home/filter/:option', (req, res) => {
    console.log('Get | User home Filter');
    switch (req.params.option) {
        case '01': curFilter = { "price": { $gte: 0, $lte: 1000 } }, displayFilter = 'price 0 - 1,000'; break;
        case '13': curFilter = { "price": { $gte: 1000, $lte: 3000 } }, displayFilter = 'price 1,001 - 3,000'; break;
        case '31': curFilter = { "price": { $gte: 3001, $lte: 10000 } }, displayFilter = 'price 3,001 - 10,000'; break;
        case '10': curFilter = { "price": { $gte: 10001, $lte: 999999999 } }, displayFilter = 'price > 10,000'; break;
        default: curFilter = { "price": { $gte: 0, $lte: 999999999 } }, displayFilter = 'all'; break;
    }
    res.redirect('/user/home');
})

// Home sort by
router.get('/home/sortby/:option', (req, res) => {
    console.log('Get | User home Sort by');
    let option = req.params.option;
    if (option === 'newest') {
        curSortby = { createdAt: -1 };
        displaySortby = 'newest';
    } else if (option === 'oldest') {
        curSortby = { createdAt: 1 };
        displaySortby = 'oldest';
    } else if (option === 'pricelowtohigh') {
        curSortby = { price: 1 };
        displaySortby = 'price low to high';
    } else if (option === 'pricehightolow') {
        curSortby = { price: -1 };
        displaySortby = 'price high to low';
    }
    res.redirect('/user/home');
})

// Home search
router.post('/home/search', (req, res) => {
    console.log('Get | User home Search');
    const key = req.body.key;
    Category.find({}).sort({ title: 1 }).exec(function (err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            Product.find({ name: { $regex: '.*' + key + '.*' } }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('userPages/home.ejs', { product: allProduct, category: allCategory });
                }
            });
        }
    })
})

router.get('/home/product/:id', (req, res) => {
    console.log('Get | User Product');
    Product.findById({ _id: req.params.id }, (function (err, product) {
        if (err) {
            console.log(err);
        } else {
            res.render('userPages/product.ejs', { product: product });
        }
    }))
})

router.post('/cart/add/:id', isLoggedIn, async (req, res) => {
    console.log('POST | User Cart Add');
    let newCart, inCart = false;
    req.user.cart.forEach(function (product) {
        if (product.id === req.params.id) {
            console.log('Product already in cart, can not add this product to cart');
            inCart = true;
        }
    })
    if (!inCart) {
        Product.findById({ _id: req.params.id }, (function (err, product) {
            if (err) {
                console.log(err);
            } else {
                newCart = {
                    id: product.id,
                    img: product.image,
                    name: product.name,
                    qty: parseInt(req.body.quantity),
                    price: product.price
                }
                req.user.cart.push(newCart);
                req.user.save();
                res.redirect('/user/home');
            }
        }))
    } else {
        res.redirect('/user/home');
    }

})

router.get('/cart', (req, res) => {
    console.log('Get | User Cart');
    res.render('userPages/cart.ejs');
})

router.get('/cart/delete/:id', (req, res) => {
    console.log('Get | User Cart Delete');
    const id = req.params.id;
    req.user.cart.forEach(function (product) {
        if (product.id === id) {
            req.user.cart.splice(req.user.cart.indexOf(product), 1);
            req.user.save();
            res.redirect('/user/cart');
        }
    })
})

router.get('/cart/buy', (req, res) => {
    console.log('Get | User Cart Buy');
    let newRecord = {
        user: req.user._id,
        date: Date.now()
    }
    Record.create(newRecord, function (err, newRecord) {
        if (err) {
            console.log(err);
        } else {
            req.user.cart.forEach(function (product) {
                let productRecord = {
                    name: product.name,
                    price: product.price,
                    qty: product.qty
                }
                newRecord.product.push(productRecord);
                Product.findById({ _id: product.id}, function (err, realProduct) {
                    if (err) {
                        console.log(err);
                    } else {
                        realProduct.so += 1;
                        realProduct.sp += product.qty;
                        realProduct.networth += (product.qty * product.price);
                        realProduct.save();
                    }        
                })
            })
            newRecord.save();
            req.user.orderRecord.push(newRecord);
            req.user.cart = [];
            req.user.save();
            res.redirect('/user/cart');
        }
    })
})

router.get('/cart/qty/inc/:id', (req, res) => {
    console.log('Get | User Cart inc Qty');
    req.user.cart.forEach(function (product) {
        if (product.id === req.params.id) {
            product.qty += 1;
            req.user.save();
            res.redirect('/user/cart');
        }
    })
})

router.get('/cart/qty/dec/:id', (req, res) => {
    console.log('Get | User Cart dec Qty');
    req.user.cart.forEach(function (product) {
        if (product.id === req.params.id) {
            if (product.qty > 1) {
                product.qty -= 1;
                req.user.save();
                res.redirect('/user/cart');
            } else {
                res.redirect('/user/cart');
            }
        }
    })
})

router.get('/record', (req, res) => {
    console.log('Get | User order Record');
    res.render('userPages/record.ejs');
})

// test delete Record
router.get('/delete/record', (req, res) => {
    req.user.orderRecord = [];
    req.user.save();
    res.redirect('/user/home');
})

// check log in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;