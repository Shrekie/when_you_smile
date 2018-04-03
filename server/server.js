require('./config/config.js');

// Package imports
var https = require('https');
var fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const secrets = require('./config/secrets.js');
const oAuthRoute = require('./routes/facebook_oauth');
const application = require('./routes/application');

var options = {
    key: fs.readFileSync(path.join(__dirname, '/../certs/ca.key')),
    cert: fs.readFileSync(path.join(__dirname, '/../certs/ca.crt')),
    requestCert: false,
    rejectUnauthorized: false
};

var app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(session({ 
	secret: secrets.sessionSecret,
	resave: true,
  	saveUninitialized: true,
  	cookie: { secure: true }
}));

app.use(express.static(__dirname + '/public/'));
app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));
app.use('/vendor', express.static(path.join(__dirname, '/../vendor')));
app.use('/assets', express.static(path.join(__dirname, '/../assets')));

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

var server = https.createServer(options, app).listen(process.env.PORT, function(){
    console.log("server started at port "+process.env.PORT);
});


//module.exports = {app};