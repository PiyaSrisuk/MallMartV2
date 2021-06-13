const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username:   { type: String, required: true },
    email:      { type: String, required: true },
    password:   { type: String, required: true },
    isAdmin:    { type: Boolean, default: false },
    cart: [
        {
            pID: { type: String, required: true},
            pImg: { type: String, required: true},
            pName: { type: String, required: true},
            pQty: { type: Number, required: true},
            pPrice: { type: Number, required: true}
        }
    ]
}, {
    timestamps: true
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);