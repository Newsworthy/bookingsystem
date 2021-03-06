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
  console.log('router.post"/"');
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
            process.env.JWT_SECRET,
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
  console.log("router.put('/forgotpassword'");
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

          // async function main() {
          //   const transporter = nodemailer.createTransport({
          //     service: 'gmail',
          //     auth: {
          //       user: 'nick.shoots.news@gmail.com',
          //       pass: process.env.GMAIL
          //     }
          //   });

          //   const mailOptions = {
          //     from: 'nick.shoots.news@gmail.com',
          //     to: user.email,
          //     subject: 'Password Reset Request',
          //     text: `Hi there. You, or someone with your email address has requested a password change. If so, please copy and paste this link in your browser: ${process.env.CLIENT_URL}/api/users/resetpassword/${token}/ - Of course, if this wasn't you, then don't do a thing. Someone is screwing around, and you might want to change your email password to be safe. This link will expire in fifteen minutes.`,
          //     html: `<strong>Password reset requested</strong><p>Hi there.</p><p>You, or someone with your email address has requested a password change. If so, please click this link to reset your password: <a href='${process.env.CLIENT_URL}/api/users/resetpassword/${token}/'>Reset Password</a></p><p>Of course, if this wasn't you, then don't do a thing. Someone is screwing around, and you might want to change your email password to be safe.</p><p>This link will expire in fifteen minutes.</p>`
          //   };

          //   transporter.sendMail(mailOptions, function (error, info) {
          //     if (error) {
          //       console.log(error);
          //     } else {
          //       console.log('Email sent: ' + info.response);
          //     }
          //   })

          // }
          // main().catch(console.error);
          const fullResetLink = process.env.CLIENT_URL + "/api/users/resetpassword/" + token;
          console.log("Link: " + fullResetLink)
          return res.status(200).json({ msg: `An email has been sent to ${email} with further instructions.` })
        }
      })
    })
  };
});

// @route GET api/users/resetpassword
// @desc Take link from email and reset password
// @access  Public

router.get('/resetpassword/:resetlink', (req, res) => {
  
  console.log("req.params: " + JSON.stringify(req.params));
  console.log("req.body " + JSON.stringify(req.body));
  const resetLink = req.params.resetlink;
  console.log("resetLink? " + resetLink);
  // verify the reset link is genuine
  jwt.verify(resetLink, process.env.JWT_SECRET, function (err, decodedData) {
    if (err) {
      return res.status(401).json({ msg: "Incorrect token or it is expired. " + err });
    } else {
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({ msg: "User with this token doesn't exist" });
        } else {
          // Success condition. Go ahead and allow the form to appear to reset the password
          console.log("Hi there, you made it! " + resetLink)
          return res.status(200).json({ msg: "I like what you got, good job!" })
        }
      })
    }
  })
});

router.put('/resetpassword/:resetLink', (req, res) => {
  console.log("router.put('/resetpassword/:resetLink'");
  const resetLink = req.params.resetLink;
  const { newPass, newPassMatch } = req.body;
  console.log("resetLink: " + resetLink)
  if (newPass !== newPassMatch) {
    return res.status(400).json({ msg: "Passwords don't match, please try again." })
  }

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