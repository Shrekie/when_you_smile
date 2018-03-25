require('./config/config.js');

// Package imports
var https = require('https');
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const application = require('./routes/application');

var app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public/'));
app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));
app.use('/vendor', express.static(path.join(__dirname, '/../vendor')));
app.use('/assets', express.static(path.join(__dirname, '/../assets')));

app.get('/error', (req, res) => {
	res.sendFile(__dirname + '/public/html/information.html');
});

// register application routes
app.use(application);

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/public/html/index.html', { root: __dirname });
});

app.listen(process.env.PORT, () => {
	console.log('Started on port ', process.env.PORT);
});

//module.exports = {app};