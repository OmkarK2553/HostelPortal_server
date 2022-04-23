const express = require('express')
const router = express.Router();

require('../db/conn')
const User = require('../model/userSchema')

router.get('/', (req, res) => {
    res.send('PBL router')
})

router.post('/register', async (req, res) => {

    const { fullname, email, userid, gender, mobile, password, confirmpassword } = req.body

    if (!fullname || !email || !userid || !gender || !mobile || !password || !confirmpassword) {
        return res.status(422).json({ error: "Please fill all the fields!" })
    }

    try {
        const userExist = await User.findOne({ email: email })

        if (userExist) {
            return res.status(422).json({ error: "Email Already Registered!" })
        }

        const user = new User({ fullname, email, userid, gender, mobile, password, confirmpassword })

        const userRegistered = await user.save();

        if (userRegistered) {
            res.status(201).json({ message: "User Registered Successfully!" })
        }
        else {
            res.status(500).json({ error: "Failed to Register!" })
        }


    }
    catch (err) {
        console.log(err);
    }


})
module.exports = router