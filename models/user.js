const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username:   {type: String, required: true},
    email:      {type: String, required: true},
    password:   {type: String, required: true},
    firstName:  {type: String},
    lastName:   {type: String},
    phone:      {type: String},
    isAdmin:    {type: Boolean, default: false},
    cart:       {type: Array, default: []}
}, {
    timestamps: true
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);