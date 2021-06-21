const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    user: { type: String, required: true },
    date: { type: Date, required: true},
    product: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Record', recordSchema);