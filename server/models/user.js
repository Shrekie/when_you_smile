var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	name: String,
	profileID: String,
	accessToken: String
});


module.exports = mongoose.model('User', User);