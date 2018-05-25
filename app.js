'use strict'

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/articles');
mongoose.Promise = global.Promise;

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views/pages`)

app.use(morgan('dev'));
app.use(flash());

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'music',
    resave: true,
    saveUninitialized: false,
    // store: new MongoStore({
    //     mongooseConnection: mongoose.connection
    // })
}));

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/asset', express.static('asset'));
app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.auth = req.user ? true : false;
    if (res.locals.auth) {
        res.locals.authUser = req.user;
        res.locals.authUser.avatarUrl = req.user.avatarUrl ? req.user.avatarUrl : "https://www.gravatar.com/avatar/eece7547006bb22bca41841eb40cb4b1?d=mm&s=200";
    }
    res.locals.success_messages = req.flash('success');
    res.locals.error_messages = req.flash('error');
    next();

});

app.use('/', require('./routes/index'));
app.use('/me', require('./routes/users'));
app.use('/topic', require('./routes/topic'));
app.use('/form', require('./routes/forms'));
app.use('/posts', require('./routes/posts'));

app.use((err, req, res, next) => {
    console.log(err);
    next();
})

app.listen(port, () => {
    console.log(`Server is running and waiting to connection on port ${port}`);
});