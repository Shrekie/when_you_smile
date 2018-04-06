var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';

process.env.PORT = 5000;

if(env === 'development'){
	process.env.MONGO_URL = 'mongodb://localhost:27017/UserApp';
}

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL,{
	useMongoClient: true
});

module.exports = {env, mongoose};

