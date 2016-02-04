/************************************************************
 * Dependencies
 ***********************************************************/

var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var LocalStrategy = require('passport-local').Strategy
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash')
var sassMiddleware = require('node-sass-middleware')
var consoletable = require('console.table')

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

// Allow read access to static files in node_modules.
app.use("/node_modules", express.static('node_modules'))

// Session
var sessionStore = new session.MemoryStore;
app.use(session({
    cookie: { secure: false, maxAge: 1800000 }, // Timeout set to 30 minutes
    store: sessionStore,
    saveUninitialized: true,
    resave: true,
    secret: 'This is a crazy secret, Shjahsk'
}))

// Flash Messaging - Returns messages to users.
app.use(flash());
app.use(function(req, res, next){
    res.locals.info = req.flash('info')
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// Sass
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public/stylesheets'),
    outputStyle: 'compressed',
    prefix:  '/stylesheets',
    debug: false,
    force: false
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
// passport.use(Account.createStrategy());
passport.use(new LocalStrategy(Account.authenticate()))
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

function ensureAuthenticated(req, res, next)
{
    if (req.isAuthenticated()) {
        try {
            console.info("You are logged in as %s", req.user.username)
        } catch(err) {
            res.redirect('/login')
        }
        return next()
    } else {
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
