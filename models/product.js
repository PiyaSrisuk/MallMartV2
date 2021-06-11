const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image:      {type: String, required: true},
    name:       {type: String, required: true},
    desc:       {type: String},
    price:      {type: Number, required: true},
    category:   {type: String, required: true}
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', productSchema);