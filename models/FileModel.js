var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var FileSchema = new Schema({
	'name' : String,
	'type' : String,
	'size' : String,
	'url' : String,
	'created_by' : String
});

module.exports = mongoose.model('File', FileSchema);


