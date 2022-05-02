const jwt = require("jsonwebtoken")
const User = require("../model/userSchema")

const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        // verifyToken will have all the details of the user

        const rootUser = User.findOne({ _id: verifyToken._id, "tokens.token": token })

        if (!rootUser) {
            throw new Error("User not found!")
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();

    } catch (e) {
        res.status(401).send("Unauthorized: No token provided!")
        console.log(e);
    }
}

module.exports = Authenticate;