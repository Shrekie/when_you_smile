//TODO: MORE COMMENTS, CLEAN-UP
//TODO: Throttle control.
var config = require('./config/config.js');

// Package imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const oAuthRoute = require('./routes/facebook_oauth');
const application = require('./routes/application');

var app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(session({ 
	secret: process.env.sessionSecret,
	resave: true,
  	saveUninitialized: true,
  	cookie: { secure: true }
}));

app.use(express.static(__dirname + '/public/'));
app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));
app.use('/vendor', express.static(path.join(__dirname, '/../vendor')));
app.use('/assets', express.static(path.join(__dirname, '/../assets')));

// FIXME: HTML retrievals through template engine.
// Also for modal.
app.get('/error', (req, res) => {
	res.sendFile(__dirname + '/public/html/information.html');
});

app.get('/userLogin', (req, res) => {
	res.sendFile(__dirname + '/public/html/userLogin.html');
});

// register application routes
app.use(oAuthRoute);
app.use(application);

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/public/html/index.html', { root: __dirname });
});

if(config.env == 'development'){
	require('./config/development.js').createDevServer(app);
}else{
	app.listen(process.env.PORT, '0.0.0.0', () => {
		console.log('Started on port ', process.env.PORT);
	});
}


//module.exports = {app};