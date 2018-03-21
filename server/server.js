require('./config/config.js');

// Package imports
var https = require('https');
var fs = require('fs');
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session');

// Custom imports
const secrets = require('./config/secrets.js');
const oAuthRoute = require('./routes/facebook_oauth');
const application = require('./routes/application');

var options = {
    key: fs.readFileSync('C:/Development/Applications/When_You_Smile/certs/ca.key'),
    cert: fs.readFileSync('C:/Development/Applications/When_You_Smile/certs/ca.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

var app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
	secret: secrets.sessionSecret,
	resave: true,
  	saveUninitialized: true,
  	cookie: { secure: false }
}));
app.use(express.static(__dirname + '/public/'));
app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')))

app.get('/error', (req, res) => {
	res.sendFile(__dirname + '/public/html/information.html');
});

// OAuth2 authentication
app.use(oAuthRoute);

// isAuthenticated 
app.use('/app/*', function(req, res, next){
	if(req.isAuthenticated()) next();
	else res.redirect('/auth/facebook')
});

// register application routes
app.use(application);

app.get('/', (req, res) => {
	if(req.isAuthenticated()) res.sendFile(__dirname + '/public/html/index.html');
	else res.redirect('/auth/facebook')
})

var server = https.createServer(options, app).listen(process.env.PORT, function(){
    console.log("server started at port "+process.env.PORT);
});

//module.exports = {app};