const router = require('express').Router();
const Product = require('../models/product.js');
const Category = require('../models/category.js');
const User = require('../models/user.js');

let bufferProduct = [{}];
let bufferCategory = [{}];

// Default home
router.get('/home', (req, res) => {
    console.log('Get | User show Product');
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            bufferCategory = allCategory;
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
    console.log('Get | Admin home Sort by');
    let sortProduct, option = req.params.option;
    if (option === 'newest') {
        sortProduct = bufferProduct.sort((a, b) => a.createdAt > b.createdAt && -1 || 1);
        console.log(sortProduct);
    } else if (option === 'oldest') {
        sortProduct = bufferProduct.sort((a, b) => a.createdAt < b.createdAt && -1 || 1);
    } else if (option === 'pricelowtohigh') {
        sortProduct = bufferProduct.sort((a, b) => a.price < b.price && -1 || 1);
    } else if (option === 'pricehightolow') {
        sortProduct = bufferProduct.sort((a, b) => a.price > b.price && -1 || 1);
    } else {
        res.redirect('/user/home');
    }
    res.render('userPages/home.ejs', { product: sortProduct, category: bufferCategory})
})

// Home filter +++
router.get('/home/filter/:option', (req, res) => {
    console.log('Get | Admin home Filter');
    let min, max;
    switch (req.params.option) {
        case '01' : min = 0, max = 1000; break;
        case '13' : min = 1001, max = 3000; break;
        case '31' : min = 3001, max = 10000; break;
        case '10' : min = 10000, max = 999999999; break;
        default : min = 0, max = 999999999; break;
    }
    let filterProduct = [];
    bufferProduct.forEach(function(product){   
        if (product.price >= min && product.price <= max) {
            filterProduct.push(product);
        }
    })
    res.render('userPages/home.ejs', { product: filterProduct, category: bufferCategory});
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
            buffCategory = allCategory;
            Product.find({category: category}, (function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    bufferProduct = allProduct;
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

router.post('/cart/add/:id', isLoggedIn, async (req, res) => {
    console.log('POST | User Cart Add');
    let newCart, inCart = false;
    req.user.cart.forEach(function(product){
        if (product.pID === req.params.id) {
            console.log('Product already in cart, can not add this product to cart');
            inCart = true;
        }
    })
    if(!inCart) {
        Product.findById({_id: req.params.id}, (function(err, product){
            if (err) {
                console.log(err);
            } else {
                newCart = {
                    pID: product.id,
                    pImg: product.image,
                    pName: product.name,
                    pQty: parseInt(req.body.quantity),
                    pPrice: product.price
                }
                req.user.cart.push(newCart);
                req.user.save();
                res.redirect('/user/home');
            }
        }))  
    }else {
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
    req.user.cart.forEach(function(product){
        if (product.pID === id) {
            req.user.cart.splice(req.user.cart.indexOf(product), 1);
            req.user.save();
            res.redirect('/user/cart');
        }
    })
})

router.get('/cart/buy', (req, res) => {
    console.log('Get | User Cart Buy');
    req.user.cart = [];
    req.user.save();
    res.redirect('/user/cart');
})

router.get('/cart/qty/inc/:id', (req, res) => {
    console.log('Get | User Cart inc Qty');
    req.user.cart.forEach(function(product){
        if(product.pID === req.params.id) {
            if(product.pID === req.params.id) {
                product.pQty += 1;
                req.user.save();
                res.redirect('/user/cart');
            }

        }
    })
})

router.get('/cart/qty/dec/:id', (req, res) => {
    console.log('Get | User Cart dec Qty');
    req.user.cart.forEach(function(product){
        if(product.pQty > 1) {
            product.pQty -= 1;
            req.user.save();
            res.redirect('/user/cart');
        }else {
            res.redirect('/user/cart');
        }
    })
})

// check log in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;