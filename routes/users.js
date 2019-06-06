const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

// User Model
const User = require('../models/users')

router.get('/login', (req, res) => {
    res.render("login")
})
router.get('/register', (req, res) => {
    res.render("register")
})

// Register Handle
router.post('/register', (req, res) => {
    // console.log(req.body)
    const { name, email, password, password2 } = req.body
    // validation
    let msgs = []
    if (!name || !email || !password || !password2) {
        msgs.push({ message: "Please fill the fields" })
    }

    if (password !== password2)
        msgs.push({ message: "Passwords are not matching" })

    if (password.length < 6)
        msgs.push({ message: "Must be greater than 6 chars" })

    if (msgs.length > 0) {
        // console.log(msgs)
        res.render('register', {
            msgs,
            name, email, password, password2
        })
    } else {
        // console.log(msgs)
        // validate user
        User.findOne({ email: email }).then(user => {
            if (user) {
                msgs.push({ message: "Email is already registered" })
                res.render('register', {
                    msgs,
                    name, email, password, password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })
                // console.log(newUser)
                // res.send(`Hello ${name}`)

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash
                        // Save the User
                        newUser.save().then(() => {
                            req.flash('success_msg', 'You are registerd and can login')
                            res.redirect('/login')
                        }
                        ).catch(err => console.log(err))
                    })
                })
            }
        })
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
})

//Handle Logout
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'Logout Successful')
    res.redirect('/login')
})
module.exports = router;