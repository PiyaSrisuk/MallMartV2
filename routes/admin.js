const router = require('express').Router();
const Product = require('../models/product.js');
const Category = require('../models/category.js');
const Record = require('../models/record.js');
const multer = require('multer');

// current option
let curCategory = {};
let curFilter = {};
let curSortby = { createdAt: -1 };

let displayCategory = 'all';
let displayFilter = 'all';
let displaySortby = 'newest';

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Upload form multer
const upload = multer({storage: fileStorageEngine});
router.post('/upload', upload.single("image"), (req, res) => {
    console.log(req.file);
    res.send("Single file upload successful");
})

// Default home
router.get('/home', (req, res) => {
    console.log('Get | Admin home');
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
                    res.render('adminPages/home.ejs', { product: allProduct, category: allCategory, 
                        displayCategory: displayCategory, displayFilter: displayFilter, displaySortby: displaySortby });
                }
            });
        }
    })
})

// Home by Category page
router.get('/home/category/:title', (req, res) => {
    console.log('Get | Admin Home by Category');
    const category = req.params.title.toLowerCase();
    if (category === 'all') {
        curCategory = {};
        displayCategory = 'all';
    } else {
        curCategory = { category: category };
        displayCategory = category.toString();
    }
    res.redirect('/admin/home');
})

// Home filter
router.get('/home/filter/:option', (req, res) => {
    console.log('Get | Admin home Filter');
    switch (req.params.option) {
        case '01': curFilter = { "price": { $gte: 0, $lte: 1000 } }, displayFilter = 'price 0 - 1,000'; break;
        case '13': curFilter = { "price": { $gte: 1000, $lte: 3000 } }, displayFilter = 'price 1,001 - 3,000'; break;
        case '31': curFilter = { "price": { $gte: 3001, $lte: 10000 } }, displayFilter = 'price 3,001 - 10,000'; break;
        case '10': curFilter = { "price": { $gte: 10001, $lte: 999999999 } }, displayFilter = 'price > 10,000'; break;
        default: curFilter = { "price": { $gte: 0, $lte: 999999999 } }, displayFilter = 'all'; break;
    }
    res.redirect('/admin/home');
})

// Home sort by
router.get('/home/sortby/:option', (req, res) => {
    console.log('Get | Admin home Sort by');
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
    res.redirect('/admin/home');
})

// Home search
router.post('/home/search', (req, res) => {
    console.log('Get | Admin home Search');
    const key = req.body.key;
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            Product.find({name: { $regex: '.*' + key + '.*' }}).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {          
                    displayCategory = 'all';
                    displayFilter = 'all';
                    displaySortby = 'newest';      
                    res.render('adminPages/home.ejs', { product: allProduct, category: allCategory, 
                        displayCategory: displayCategory, displayFilter: displayFilter, displaySortby: displaySortby });
                }
            });
        }
    })
})

// Edit GET
router.get('/edit-product/:id', (req, res) => {
    console.log('Get | Admin edit');
    const product = req.params.id;
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory){
        if (err) {
            console.log(err);
        } else {
            Product.findById({_id: product}, (function(err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('adminPages/editProduct.ejs', {category: allCategory, product: allProduct})
                }
            }))
        }
    })
})

// Edit POST
router.post('/edit-product/:id', (req, res) => {
    console.log('POST | Admin edit');
    const editProduct = {
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        category: req.body.category
    }
    Product.findByIdAndUpdate({_id: req.params.id}, editProduct, (function(err, product){
        if (err) {
            console.log(err);
            req.flash('error', 'Edit product failed');
        } else {
            console.log("Update product successful " + product.name);
            req.flash('success', 'Edit product successful');
            res.redirect('/admin/home');
        }
    }))
})

// Delete POST
router.post('/delete-product', (req, res) => {
    console.log('POST | Admin delete');
    const id = req.body.id;
    Product.findByIdAndDelete({_id: id}, (function (err, product){
        if (err) {
            console.log(err);
            req.flash('error', 'Deleted product failed');
        } else {
            console.log("-----Delete product successful " + product.name);
            req.flash('success', 'Deleted product successful');
            res.redirect('/admin/home');
        }
    }))
})

// Category page
router.get('/category', (req, res) => {
    console.log('Get | Admin category');
    Category.find({}).sort({ title: 1}).exec(function (err, category){
        if (err) {
            console.log(err);
        } else {
            bufferCategory = category;
            res.render('adminPages/category.ejs', { category: category });
        }
    })
})

// New Category
router.post('/category/new', (req, res) => {
    console.log('Get | Admin new category');
    const title = { title: req.body.title.toLowerCase() };
    Category.create(title, function(err, title){
        if(err) {
            console.log(err);
            req.flash('error', 'New category failed');
        } else {
            console.log('-----New category added (' + title + ')');
            req.flash('success', 'New category successful');
            res.redirect('/admin/category');
        }
    })
})

// Delete category
router.post('/category/delete', (req, res) => {
    console.log('Get | Admin delete category');
    const title = req.body.title.toLowerCase();
    Category.findOneAndDelete({ title: title }, function(err, title){
        if(err) {
            console.log(err);
            req.flash('error', 'Deleted category failed');
        } else {
            console.log('-----Delete category ' + title);
            req.flash('success', 'Deleted category successful');
            res.redirect('/admin/category');      
        }           
    })
})   

// Get new Product
router.get('/new-product', (req, res) => {
    console.log('Get | Admin new Product');
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory){
        if (err) {
            console.log(err);
        } else {
            res.render('adminPages/newProduct.ejs', {category: allCategory})
        }
    })
})

// Post new Product
router.post('/new-product', upload.single("image"), (req, res) => {
    console.log('POST | Admin new Product');
    const newProduct = { 
        image: "/images/" + req.file.filename,
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        category: req.body.category
    }
    Product.create(newProduct, function(err, product){
        if (err) {
            console.log(err);
            req.flash('error', 'Created new product failed');
        } else {
            console.log('-----New product added ' + product.name);
            req.flash('success', 'Created new product successful');
            res.redirect('/admin/new-product');
        }
    })
})

// Order record
router.get('/record', (req, res) => {
    console.log('Get | Admin order record');
    Product.find({}).sort({sp: -1, so: -1, networth: -1, price: -1}).exec(function (err, allProduct) {
        if (err) {
            console.log(err);
        } else {
            res.render('adminPages/record.ejs', { product: allProduct });
        }
    })
})

// Log out
router.get('/logout', function (req, res) {
    req.logout();
    console.log('logout success')
    res.redirect('/login');
});

module.exports = router;