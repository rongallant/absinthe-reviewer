/************************************************************
 * Dependencies
 ***********************************************************/

var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var PassportLocalStrategy = require('passport-local').Strategy
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash');
var sassMiddleware = require('node-sass-middleware');
var consoletable = require('console.table');

/************************************************************
 * Models
 ***********************************************************/

var Account = require('./models/account')

/************************************************************
 * Routes
 ***********************************************************/

var routes = require(path.join(__dirname, 'routes/login'))
var accounts = require(path.join(__dirname, 'routes/accounts'))
var absinthes = require(path.join(__dirname, 'routes/absinthes'))
var reviews = require(path.join(__dirname, 'routes/reviews'))
var information = require(path.join(__dirname, 'routes/information'))
var autocomplete = require(path.join(__dirname, 'routes/autocomplete'))

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
    cookie: { maxAge: 1800000 }, // Timeout set to 30 minutes
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    secret: 'keyboard cat'
}))

// Flash Messaging - Returns messages to users.
app.use(flash());
app.use(function(req, res, next){
    res.locals.info = req.flash('info')
    res.locals.success = req.flash('success')
    res.locals.errors = req.flash('error')
    next()
})

// Sass
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public/stylesheets'),
    outputStyle: 'compressed',
    prefix:  '/stylesheets',
    debug: false,
    force: true
}));

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
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// passport.use(new PassportLocalStrategy(Account.authenticate()))
passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())


function ensureAuthenticated(req, res, next)
{
    if (req.isAuthenticated()) {
        try {
            console.info("You are logged in as %s", req.user.username)
        } catch(err) {
            console.info("\nERROR: You are not logged in")
            req.session.destroy();
            res.redirect('/login')
        }
        return next()
    } else {
        req.session.destroy();
        res.redirect('/login')
    }
}

// Secure Routes

app.get('/login', routes)
app.get('/:name', routes)
app.use('/', routes)

app.get('/accounts', ensureAuthenticated, accounts)
app.get('/accounts*', ensureAuthenticated, accounts)
app.use('/accounts', accounts)

app.get('/absinthes', ensureAuthenticated, absinthes)
app.get('/absinthes*', ensureAuthenticated, absinthes)
app.use('/absinthes', absinthes)

app.get('/reviews', ensureAuthenticated, reviews)
app.get('/reviews*', ensureAuthenticated, reviews)
app.use('/reviews', reviews)

app.get('/information', ensureAuthenticated, information)
app.get('/information*', ensureAuthenticated, information)
app.use('/information', information)

app.get('/autocomplete', ensureAuthenticated, autocomplete)
app.get('/autocomplete*', ensureAuthenticated, autocomplete)
app.use('/autocomplete', autocomplete)

/************************************************************
 * Error Handling
 ***********************************************************/

/**
 * catch 404 Page Not Found errors.
 */
app.use(function(req, res, next) {
    var err = new Error('Page Not Found')
    err.status = 404
    next(err)
})

/**
 * catch 403 Unauthorized errors.
 */
app.use(function(req, res, next) {
    var err = new Error('Unauthorized')
    err.status = 403
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
