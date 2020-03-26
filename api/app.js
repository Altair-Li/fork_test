const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require("cors");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cookieSession = require("cookie-session");

const app = express();
app.set('trust proxy', true);app.use(cookieSession({
	name: 'session'
	, secret: "dfasdlkfjsaldfa"
	, httpOnly: true
	, maxAge: 30 * 60 * 1000
	, secure: false
	, overwrite: false
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors({credentials: true}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/', indexRouter);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
});