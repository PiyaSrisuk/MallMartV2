const router = require('express').Router();
const Product = require('../models/product.js');
let bufferProduct = [{}];
const Category = require('../models/category.js');
const multer = require('multer');

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
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            Product.find({}).sort({ createdAt: -1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    bufferProduct = allProduct;
                    console.log(bufferProduct);
                    bufferProduct.sort((a, b) => a.price > b.price && -1 || 1);
                    console.log(bufferProduct);
                    res.render('adminPages/home.ejs', { product: bufferProduct, category: allCategory });
                }
            });
        }
    })
})

// Home sort by
router.get('/home/sortby/:option', (req, res) => {
    console.log('Get | Admin home Sort by');
    Category.find({}).sort({ title: 1}).exec(function(err, allCategory) {
        if (err) {
            console.log(err);
        }
        else if (req.params.option === 'newest') {
            Product.find({}).sort({ createdAt: -1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('adminPages/home.ejs', { product: allProduct, category: allCategory });
                }
            })
        }
        else if (req.params.option === 'oldest') {
            Product.find({}).sort({ createdAt: 1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('adminPages/home.ejs', { product: allProduct, category: allCategory });
                }
            });
        }
        else if (req.params.option === 'pricelowtohigh') {
            Product.find({}).sort({ price: 1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('adminPages/home.ejs', { product: allProduct, category: allCategory });
                }
            });
        }
        else if (req.params.option === 'pricehightolow') {
            Product.find({}).sort({ price: -1 }).exec(function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('adminPages/home.ejs', { product: allProduct, category: allCategory });
                }
            });
        }
        else {
            Product.find({}, (function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('adminPages/home.ejs', { product: allProduct, category: allCategory });
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
                    bufferProduct = allProduct;                   
                    res.render('adminPages/home.ejs', { product: bufferProduct, category: allCategory });
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
        } else {
            console.log("Update product successful " + product.name);
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
        } else {
            console.log("-----Delete product successful " + product.name);
            res.redirect('/admin/home');
        }
    }))
})

// Home by Category page
router.get('/home/category/:title', (req, res) => {
    console.log('Get | Admin Home by Category');
    const category = req.params.title.toLowerCase();
    Category.find({}, (function (err, allCategory) {
        if (err) {
            console.log(err);
        } else {
            Product.find({category: category}, (function (err, allProduct) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('adminPages/home.ejs', { category: allCategory, product: allProduct });
                }
            }))
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
        } else {
            console.log('-----New category added (' + title + ')');
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
        } else {
            console.log('-----Delete category ' + title);
            res.redirect('/admin/category');      
        }           
    })
})   

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
        } else {
            console.log('-----New product added ' + product.name);
            res.redirect('/admin/new-product');
        }
    })
})

// Optional
// Order record
router.get('/order-record', (req, res) => {
    console.log('Get | Admin order record');
    res.render('adminPages/orderRecord.ejs')
})

router.get('/logout', function (req, res) {
    req.logout();
    console.log('logout success')
    res.redirect('/login');
});

module.exports = router;