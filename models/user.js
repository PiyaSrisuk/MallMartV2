const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username:   { type: String, required: true },
    email:      { type: String, required: true },
    password:   { type: String, required: true },
    isAdmin:    { type: Boolean, default: false },
    cart: [
        {
            id: { type: String, required: true},
            img: { type: String, required: true},
            name: { type: String, required: true},
            qty: { type: Number, required: true},
            price: { type: Number, required: true}
        }
    ],
    orderRecord: []
}, {
    timestamps: true
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);