var mongoose = require('mongoose');var Schema = mongoose.Schema;var UserSchema = new Schema({    'dob': Date,    'name': String,    'bio': String,    'photoURL': String,    'uid': String,    'phone': String,    'email': {type: String, unique: true, required: true, lowercase: true, trim: true},    'address1': String,    'city': String,    'state': String,    'country': String,    'pincode': Number,    'cover': { type: Schema.ObjectId, ref: 'File' },    'regid': String,    'gender': String,    'hobbies': [String],    'currentLocation': { 'type': {"type": String, "enum": "Point", "default": "Point"}, "coordinates": { 'type': [Number],   'default': [0,0]} }});UserSchema.index({'currentLocation': '2dsphere','$**':'text'});module.exports = mongoose.model('User', UserSchema);