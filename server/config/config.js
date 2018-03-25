//var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
	process.env.PORT = 3000;
	//process.env.dbURI = 'mongodb://localhost:27017/UserApp';
}else if(env === 'test'){
	process.env.PORT = 3000;
	//process.env.dbURI = 'mongodb://localhost:27017/UserAppTest';
}

/*
mongoose.Promise = global.Promise;

mongoose.connect(process.env.dbURI,{
	useMongoClient: true
});

module.exports = {mongoose};

*/