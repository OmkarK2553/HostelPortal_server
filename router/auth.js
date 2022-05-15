const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("PBL router");
});

router.get("/dashboard", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(users);
    }
  });
});

router.get("/maleusers", (req, res) => {
  User.find(
    {
      gender: "M",
    },
    (err, users) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send({ result: "success", users });
      }
    }
  );
});
router.get("/femaleusers", (req, res) => {
  User.find(
    {
      gender: "F",
    },
    (err, users) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send({ result: "success", users });
      }
    }
  );
});
// router.post("/editUser", (req, res) => {
//   const { fullname, email, userid, gender, mobile, password } =
//     req.body;
//   User.findByIdAndUpdate(
//     req.body.userid,
//     {
//       $set: {
//         fullname: req.body.fullname,
//         email: req.body.email,
//         mobile: req.body.mobile,
//         password: req.body.password,
//         role: req.body.role,

//       },
//     },
//     (err, user) => {
//       if (err) {
//         res.status(400).send(err);
//       } else {
//         res.send(user);
//       }
//     }
//   );

router.post("/register", async (req, res) => {
  const {
    fullname,
    email,
    userid,
    gender,
    // isAdmin,
    mobile,
    password,
    confirmPassword,
  } = req.body;

  if (
    !fullname ||
    !email ||
    !userid ||
    !gender ||
    // !isAdmin ||
    !mobile ||
    !password ||
    !confirmPassword
  ) {
    console.log(
      fullname,
      email,
      userid,
      gender,
      // isAdmin,
      mobile,
      password,
      confirmPassword
    );
    return res.status(422).json({
      error: "Please fill all the fields!",
      fullname,
      email,
      userid,
      gender,
      // isAdmin,
      mobile,
      password,
      confirmPassword,
    });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      console.log(userExist);
      return res.status(422).json({ error: "Email Already Registered!" });
    } else if (password != confirmPassword) {
      return res.status(422).json({ error: "Passwords are not matching!" });
    }


    if (userExist) {
      console.log(userExist);
      return res.status(422).json({ error: "Email Already Registered!" });
    } else if (password != confirmPassword) {
      return res.status(422).json({ error: "Passwords are not matching!" });
    }

    const user = new User({
      fullname,
      email,
      userid,
      gender,
      mobile,
      password,
      confirmPassword,
    });

    // middleware will be called for hashing password
    const userRegistered = await user.save();

    console.log(`${user} registered successfully!`);

    if (userRegistered) {
      res.status(201).json({ message: "User Registered Successfully!" });
    } else {
      res.status(500).json({ error: "Failed to Register!" });
    }
  } catch (err) {
    console.log(err);
  }
});

let currUser;
router.post("/userlogin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please enter the required fields!" });
    }

    const userLogin = await User.findOne({ email: email }); // returns object with the desired email
    currUser = userLogin;
    console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      // token = await userLogin.generateAuthToken();

      // res.cookie("jwtoken", token);
      // name,value,callback(optional)

      if (!isMatch) {
        res
          .status(400)
          .json({ error: "Invalid Credentials!" });
      } else {
        res.json({ message: "Login Successfully!" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials!" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = currUser;
module.exports = router;
