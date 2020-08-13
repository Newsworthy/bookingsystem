const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');


// @route POST api/users
// @desc register new user
// @access Public

router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    console.log("User sequence starting");
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please ensure you enter all fields" });
    }

    User.findOne({ email }).then((user) => {
        if (user) return res.status(400).json({ msg: "User already exists" });

        const newUser = new User({
            name,
            email,
            password,
        });
        // newUser.save()
        //     .then(user => {
        //         res.send("User saved to database")
        //         console.log("New user " + newUser.name + " registered")
        //     })
        //     .catch(err => {
        //         res.status(400).send("Something went wrong");
        //         console.log("Something went wrong...");
        //     });

        // Salting and hashing here

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

module.exports = router;