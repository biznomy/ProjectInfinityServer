var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CommentSchema = new Schema({
	'user_id' : {type: Schema.ObjectId, ref: 'User'},
	'post_id' : String,
	'description' : String,
	'files' : {type: Schema.ObjectId, ref: 'File'},
	'created_at':Date
});

module.exports = mongoose.model('Comment', CommentSchema);
