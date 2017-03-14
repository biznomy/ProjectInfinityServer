var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LikeSchema = new Schema({
	'user_id' : {type: Schema.ObjectId, ref: 'User'},
	'post_id' : String
});

module.exports = mongoose.model('Like', LikeSchema);
