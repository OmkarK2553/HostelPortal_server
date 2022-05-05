const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    isAdmin: {
        type: String
    },
    gender: {
        type: String,
        enum: ['M', 'F'],
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
    },
    // user will login multiple times..hence array of objects
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

// hashing the password (middleware)

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hash(this.password, 12);  // 12 rounds
        this.confirmPassword = bcrypt.hash(this.confirmPassword, 12)
    }
    next();
})

// we are genersting the token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
        // jwt.sign(payload,secretkey)  payload=unique
    } catch (e) {
        console.log(e);
    }
}


const User = mongoose.model('USER', userSchema)

module.exports = User