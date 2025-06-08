const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const authRouter = require('./routes/auth.route');
const captchaRouter = require('./routes/captcha.route.js');

const app = express();

app.use(session({
    secret: 'session-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRouter);
app.use('/', captchaRouter);

module.exports = app;
