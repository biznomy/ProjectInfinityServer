var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var FriendSchema = new Schema({
	'user1' : {type: Schema.ObjectId, ref: 'User'},
	'user2' : {type: Schema.ObjectId, ref: 'User'},
	'status' : String
});

module.exports = mongoose.model('Friend', FriendSchema);
