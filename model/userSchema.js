const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userid
        : {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    }

})




// hashing the password (middleware)

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hash(this.password, 12);  // 12 rounds
        this.confirmPassword = bcrypt.hash(this.confirmPassword, 12)
    }
    next();
})


const User = mongoose.model('USER', userSchema)

module.exports = User