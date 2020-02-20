const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// @routes  POST api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  [
    check("name", "Please add a name")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exist" });
      }

      let icons = [
        "https://i.ibb.co/wNj3qBy/1.jpg",
        "https://i.ibb.co/ZNcc1Jp/2.jpg",
        "https://i.ibb.co/dKHKJH7/3.jpg",
        "https://i.ibb.co/Yk2GgWg/4.jpg",
        "https://i.ibb.co/QjgNr0F/5.jpg",
        "https://i.ibb.co/dDhg5yT/6.jpg"
      ];
      let icon = icons[Math.ceil(Math.random() * 6)];

      user = new User({ name, email, password, icon });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
