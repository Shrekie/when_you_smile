var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	name: String,
	profileID: String
});


module.exports = mongoose.model('User', User);