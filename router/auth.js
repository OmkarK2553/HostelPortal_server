const express = require('express')
const bcrypt = require('bcryptjs')
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
        else if (password != confirmpassword) {
            return res.status(422).json({ error: "Passwords are not matching!" })
        }

        const user = new User({ fullname, email, userid, gender, mobile, password, confirmpassword })

        // middleware will be called for hashing password
        const userRegistered = await user.save();

        console.log(`${user} registered successfully!`);

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

    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Please enter the required fields!" })
            }

            const userLogin = await User.findOne({ email: email })  // returns object with the desired email

            if (userLogin) {
                const isMatch = await bcrypt.compare(password, userLogin.password);

                if (!isMatch) {
                    res.status(400).json({ error: "Invalid Credentials!" })

                }
                res.json({ message: "Login Successful!" })
            }
            else {
                res.status(400).json({ error: "Invalid Credentials!" })
            }



        }
        catch (err) {
            console.log(err);
        }
    })


})
module.exports = router