const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image:      {type: String, required: true},
    name:       {type: String, required: true},
    desc:       {type: String},
    price:      {type: Number, required: true},
    category:   {type: String, required: true},
    so:        {type: Number, default: 0}, // sold order
    sp:        {type: Number, default: 0}  // sold piece
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', productSchema);