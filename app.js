/************************************************************
 * Dependencies
 ***********************************************************/

var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy
var sassMiddleware = require('node-sass-middleware');

/************************************************************
 * Models
 ***********************************************************/

var Account = require('./models/account') // TODO Replace with User
// var User = require('./models/user')

/************************************************************
 * Route Includes
 ***********************************************************/

var routes = require(path.join(__dirname, 'routes/login'))
var review = require(path.join(__dirname, 'routes/reviews'))
var users = require(path.join(__dirname, 'routes/users'))

/************************************************************
 * App Config
 ***********************************************************/

var app = express()

app.locals.title = 'Absinthe Review'
app.locals.email = 'ron@rongallant.com'

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('view options', { layout: false })
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true})) // to support URL-encoded bodies
app.use(cookieParser('keyboard cat'))

// Session
var sessionStore = new session.MemoryStore;
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'keyboard cat'
}))
app.use(flash());

// Sass
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public/stylesheets'),
    prefix:  '/stylesheets',
    debug: true,
    force: true
}));

// Flash Messaging - Returns messages to users.
app.use(function(req, res, next){
    res.locals.info = req.flash('info')
    res.locals.success = req.flash('success')
    res.locals.errors = req.flash('error')
    next()
})

/************************************************************
 * Database
 ***********************************************************/

// MongooseJS / MongoDB
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4')
mongoose.set('debug', false)

/************************************************************
 * Security
 ***********************************************************/

app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

// passport config
passport.use(new LocalStrategy(Account.authenticate()))
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}

// Secure Routes

app.get('/login', routes)
app.get('/:name', ensureAuthenticated, routes)
app.use('/', routes)

app.get('/users', users)
app.get('/users:name', ensureAuthenticated, users)
app.use('/users', users)

app.get('/review', review)
app.get('/review:name', ensureAuthenticated, review)
app.use('/review', review)

/************************************************************
 * Error Handling
 ***********************************************************/

/**
 * catch 403 and forward to error handler.
 */
app.use(function(req, res, next) {
    if (!req.user) {
        var err = new Error('Unauthorized')
        err.status = 403
    }
    next(err)
})

/**
 * catch 404 and forward to error handler.
 */
app.use(function(req, res, next) {
    var err = new Error('Page Not Found')
    err.status = 404
    next(err)
})

/**
 * Development error handler.
 * Will print stacktrace.
 */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

/**
 * Production error handler.
 * No stacktraces leaked to user.
 * */
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

/************************************************************
 * Return App
 ***********************************************************/

module.exports = app
