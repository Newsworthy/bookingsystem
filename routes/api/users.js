const express = require("express");
require('dotenv').config();
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const _ = require('lodash');
// Item model
const User = require("../../models/User");

// @route POST api/users
// @desc register new user
// @access  Public

router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  // Simple Validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({
      name,
      email,
      password,
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

// @route PUT api/users/forgotpassword
// @desc Activate token and email user
// @access  Public

router.put('/forgotpassword', (req, res) => {
  // console.log("Here is req.body: " + JSON.stringify(req.body))
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Please enter all fields" });
  } else {

    // Find existing User by email address
    User.findOne({ email }).then((user) => {
      if (!user) return res.status(400).json({ msg: "That email doesn't exist with us..." });
      const payload = {
        id: user._id,
      }
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, {
        expiresIn: '15m'
      });

      const newLink = {
        resetLink: token,
      }
      // Take resetLink and implant it into user record
      user = _.extend(user, newLink);
      user.save((err, result) => {
        if (err) {
          return res.status(400).json({ msg: "Something went wrong..." + err });
        } else {
          // Begin mailout function

          async function main() {
            const testAccount = await nodemailer.createTestAccount();
            console.log("Client URL is: " + process.env.CLIENT_URL)
            const transporter = nodemailer.createTransport({
              host: "smtp.ethereal.email",
              port: 587,
              secure: false,
              auth: {
                user: testAccount.user,
                pass: testAccount.pass,
              },
            }),

              info = await transporter.sendMail({
                from: '<derp@herp.com>',
                to: user.email,
                subject: "Password reset",
                text: `Hi there. You, or someone with your email address has requested a password change. If so, please copy and paste this link in your browser: ${process.env.CLIENT_URL}/api/users/resetpassword/${token}/ - Of course, if this wasn't you, then don't do a thing. Someone is screwing around, and you might want to change your email password to be safe. This link will expire in fifteen minutes.`,
                html: `<strong>Password reset requested</strong><p>Hi there.</p><p>You, or someone with your email address has requested a password change. If so, please click this link to reset your password: <a href='${process.env.CLIENT_URL}/api/users/resetpassword/${token}/'>Reset Password</a></p><p>Of course, if this wasn't you, then don't do a thing. Someone is screwing around, and you might want to change your email password to be safe.</p><p>This link will expire in fifteen minutes.</p>`
              });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

          }
          main().catch(console.error);

          return res.status(200).json({ msg: `An email has been sent to ${email} with further instructions` })
        }
      })
    })
  };
});

// @route PUT api/users/resetpassword
// @desc Take link from email and reset password
// @access  Public

router.get('/resetpassword/:resetLink', (req, res) => {
  const { resetLink } = req.params;
  console.log("Hi there, you made it! " + resetLink)
});

router.put('/resetpassword/:resetLink', (req, res) => {
  const { resetLink } = req.params;
  const { newPass } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, process.env.JWT_SECRET, function (err, decodedData) {
      if (err) {
        return res.status(401).json({ msg: "Incorrect token or it is expired." });
      }
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({ msg: "User with this token doesn't exist" });
        }
        // My god you better hash this
        console.log("newPass is: " + newPass)

        bcrypt.hash(newPass, 10, (err, hash) => {
          console.log("Hash is: " + hash);

          const obj = {
            password: hash,
            resetLink: ''
          }

          user = _.extend(user, obj);
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({ msg: "Reset password error" });
            } else {
              return res.status(200).json({ msg: "Your password has been changed." });
            }
          })
        })
      })
    })
  } else {
    return res.status(401).json({ msg: "Authentication error!" });
  }
});

module.exports = router;
