var mongoose = require('mongoose');
var Product = require('./models/product.js');
var Category = require('./models/category.js');

var data = [
    {
        image: 'https://th-test-11.slatic.net/p/e45db12146ab3c620e7b5d286bac70ea.jpg',
        name: 'เสื้อเชิดสีดำ',
        desc: 'ราคาถูก ใส่สบาย',
        price: 300,
        category: 'wearing'
    },
    {
        image: 'https://f.btwcdn.com/store-35589/product/a437a011-262c-d539-210e-5b1a28236140.jpg',
        name: 'กางเกงวอร์ม',
        desc: 'ใส่สบาย ราคาถูก ไม่ขาดง่าย',
        price: 700,
        category: 'wearing'
    },
    {
        image: 'https://fi.lnwfile.com/_/fi/_raw/jw/8e/p8.jpg',
        name: 'เคสคอมพิวเตอร์ px-225',
        desc: 'ทนทาน กันกระแทก ไม่แตกง่าย',
        price: 1_500,
        category: 'electronics'
    },
    {
        image: 'http://www.maamjourney.com/wp-content/uploads/2021/01/pic1.jpg',
        name: 'รองเท้า',
        desc: 'ใส่สบาย สีสันเรียบง่าย',
        price: 999,
        category: 'wearing'
    },
    {
        image: 'https://cw.lnwfile.com/x5advs.jpg',
        name: 'แป้งโยคี',
        desc: 'ในรัศมีวงกลม',
        price: 50,
        category: 'healthy'
    },
    {
        image: 'https://cl.lnwfile.com/3fgujx.jpg',
        name: 'เม้าส์ปากกา',
        desc: 'เขียนลื่นดั่งใจ ทนต่อแรงกด',
        price: 3_750,
        category: 'electronics'
    },
    {
        image: 'https://mpics.mgronline.com/pics/Images/564000003615401.JPEG',
        name: 'รองเท้าแตะ ตราช้างดาว',
        desc: 'ทนทานไม่ขาดง่าย',
        price: 99,
        category: 'wearing'
    },
    {
        image: 'https://ce.lnwfile.com/f7f9jh.jpg',
        name: 'หมวกกันกันน็อค',
        desc: 'กันได้แม้กระทั่งกระสุน',
        price: 1_250,
        category: 'wearing'
    },
    {
        image: 'https://bucket.fitwhey.com/ProductType/3bcf4108f8ed82e464dd7544dd7972d1.png',
        name: 'เวย์โปรตีน',
        desc: 'อาหารเสริมคุณค่าสูง',
        price: 750,
        category: 'food'
    },
    {
        image: 'https://aumento.officemate.co.th/media/catalog/product/O/F/OFM0008335.jpg',
        name: 'นม UHT รสจืด',
        desc: '225 มล. 6 กล่อง',
        price: 85,
        category: 'food'
    },
    {
        image: 'https://d1a2ggqmhsoom.cloudfront.net/s4lMtMqR5vcTSKVKvRtJinx3us0=/fit-in/346x500/filters:quality(90):fill(ffffff)/http://static-catalog.supersports.co.th/p/king-7748-02642-1.jpg',
        name: 'ดัมเบล',
        desc: 'ทำให้การออกกำลังกายเป็นเรื่องง่าย',
        price: 870,
        category: 'healthy'
    },
    {
        image: 'https://th-test-11.slatic.net/original/fe2ec054c9cefba0089f18f24cbe61aa.jpg',
        name: 'จอมอนิเตอร์',
        desc: 'ขนาด 32 นิ้ว',
        price: 15_999,
        category: 'electronics'
    },
    {
        image: 'https://contents.mediadecathlon.com/p1574227/k$072772ed87e3bde118516412d3047610/mountain-trekking-hat-trek-100-khaki.jpg?format=auto&f=800x800',
        name: 'หมวก',
        desc: 'ใส่สบาย',
        price: 199,
        category: 'wearing'
    },
    {
        image: 'https://th-test-11.slatic.net/p/a6170e913e6d2d4b8799c9982812da9d.jpg_720x720q80.jpg_.webp',
        name: 'การ์ดจอ RTX2080Ti',
        desc: 'แรงมาก แรงที่สุด',
        price: 99_000,
        category: 'electronics'
    },
    {
        image: 'https://www.jib.co.th/img_master/product/original/20190724114109_34417_24_1.png',
        name: 'ซีพียู ryzen 7 5800XT',
        desc: 'ประหยัดไฟ ทำงานไวกว่าเดิม',
        price: 19_750,
        category: 'electronics'
    }
];

var category = [
    {
        title: 'electronics'
    },
    {
        title: 'healthy'
    },
    {
        title: 'food'
    },
    {
        title: 'wearing'
    }
]

function seedDB(){
    Product.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Remove Products completed");
        data.forEach(function(seed){
            Product.create(seed, function(err, collection){
                if(err) {
                    console.log(err);
                } else {
                    console.log('-----New product added');
                }
            });
        });     
    });
    Category.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Remove Categories completed");
        category.forEach(function(title){
            Category.create(title, function(err, collection){
                if(err) {
                    console.log(err);
                } else {
                    console.log('-----New category added')
                }
            })
        })  
    });
}

module.exports = seedDB;
