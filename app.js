//Dependencies
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const db = require('./config/keys').MongoURI
mongoose.connect(db, { useNewUrlParser: true })
    .then(console.log("Mongodb Connected"))
    .catch(err => console.log(err))


//Initialize Express
const app = express()
require('./config/passport')(passport)
//EJS
app.use('/static', express.static('static'))
app.use(expressLayouts)
app.set('view engine', 'ejs')

// BodyParser
app.use(express.urlencoded({ extended: false }))

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//connect -flash
app.use(flash())

// Global Variables
app.use((req, res, next) => {
    res.locals.SUCCESS_MSG = req.flash('success_msg')
    res.locals.ERROR_MSG = req.flash('error_msg')
    res.locals.ERROR = req.flash('error')
    next()
})

//Setting a default PORT
const PORT = process.env.PORT || 3000;

//Routers
app.use('/', require('./routes/index'))
app.use('/', require('./routes/users'))

//Serving the contents
app.listen(PORT, () => {
    console.log("Server is Running");
})