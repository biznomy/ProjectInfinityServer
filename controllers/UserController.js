var UserModel = require('../models/UserModel.js'),
    FIREBASE = require('../firebase'),
    FriendModel = require('../models/FriendModel.js'),
    UserModel = require("../models/UserModel");

module.exports = {

    suggestion: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var myId = req["me"]["__id"],self = this;
        var q = { "$and": [{ "$or": [{ "user1": myId }, { "user2": myId }] }, { "status": "friend" }] };

        FriendModel.find(q).select("user1 user2").exec(function(err, data) {
            if (!err) {
                if (data.length > 0) {
                    var t1 = "'" + myId + "'";
                    var frnds = data.map(function(f) {
                        var t2 = "'" + f.user1 + "'";
                        if (t1 == t2) {
                            return f.user2;
                        } else {
                            return f.user1;
                        }
                    });
                    frnds.push(myId);
                    console.log(frnds);
                    self._list(req, res, { "$nin": frnds });
                } else {
                    self._list(req, res, { "$ne": myId });
                }
            } else {
                return res.json({ status: false, result: [] });
            }
        });
    },
    search: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var page = req.query.page ? req.query.page - 1 : 0,
            limit = req.query.limit ? req.query.limit : 5,
            skip = page * limit;
        var searchString = req.query.searchString ? { '$search': req.query.searchString } : null;
        var select = "_id name photoURL email gender";
        var location = req.query.lat && req.query.long ? [req.query.long, req.query.lat] : req["me"].currentLocation.coordinates;
        req.query.minDis = req.query.minDis ? req.query.minDis : 10;
        req.query.maxDis = req.query.maxDis ? req.query.maxDis : 1000;
        var q = { "currentLocation": { "$near": { "$geometry": { "type": "Point", "coordinates": location }, "$minDistance": req.query.minDis, "$maxDistance": req.query.maxDis } } }
        if (searchString) {
            if(!req.query.lat && !req.query.long){
              q = {};
            }
            q['$text'] = searchString;
        }
        UserModel.find(q).select(select).skip(Number(skip)).limit(Number(limit)).exec(function(err, nearUsers) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error when getting users.',
                    error: err
                });
            }
            UserModel.count(q).exec(function(e, count) {
                return res.json({ 'status': true, 'result': nearUsers, 'count': count });
            });
        })
    },
    _list: function(req, res, ids) {
        var select = "_id name photoURL email gender";
        var q ={ "_id": ids };
        UserModel.find(q).select(select).limit(10).exec(function(err, suggestion) {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Error when getting suggestion.',
                    error: err
                });
            }
            UserModel.count(q).exec(function(e, count) {
                return res.json({ 'status': true, 'result': suggestion, 'count': count });
            });
        });
    },
    show: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var id = req.params.id;
        if (id == "me") {
            id = req["me"]["__id"];
        }
        UserModel.findOne({ _id: id }).populate({ path: 'cover', select: "_id name size url type" }).exec(function(err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }
            return res.json(User);
        });
    },

    create: function(req, res) {
        var User = new UserModel(req.body);

        User.save(function(err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating User',
                    error: err
                });
            }
            return res.status(201).json(User);
        });
    },

    _update: function(req, res, User) {
        User.dob = req.body.dob ? req.body.dob : User.dob;
        User.name = req.body.name ? req.body.name : User.name;
        User.bio = req.body.bio ? req.body.bio : User.bio;
        User.photoURL = req.body.photoURL ? req.body.photoURL : User.photoURL;
        User.uid = req.body.uid ? req.body.uid : User.uid;
        User.phone = req.body.phone ? req.body.phone : User.phone;
        User.email = req.body.email ? req.body.email : User.email;
        User.address1 = req.body.address1 ? req.body.address1 : User.address1;
        User.city = req.body.city ? req.body.city : User.city;
        User.state = req.body.state ? req.body.state : User.state;
        User.country = req.body.country ? req.body.country : User.country;
        User.pincode = req.body.pincode ? req.body.pincode : User.pincode;
        User.cover = req.body.cover ? req.body.cover : User.cover;
        User.gender = req.body.gender ? req.body.gender : User.gender;
        User.hobbies = req.body.hobbies ? req.body.hobbies : User.hobbies;
        User.currentLocation = req.body.currentLocation ? req.body.currentLocation : User.currentLocation;
        User.regid = req.body.regid || req.body.regid == "" ? req.body.regid : User.regid;

        User.save(function(err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when updating User.',
                    error: err
                });
            }

            return res.json(User);
        });
    },

    remove: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var id = req.params.id;
        UserModel.findByIdAndRemove(id, function(err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the User.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
    getByUidFromFirebase: function(req, res) {
        if (req.error) {
            res.status(403).json(req.error);
            return;
        }
        FIREBASE.getByUidFromFirebase(req.params.uid, function() {

        });
    },
    sendPushNotification: function(req, res) {
        FIREBASE.getByUidFromLocal(req, function(rs) {
            if (rs.status && rs.result.regid != '') {
                req.body["to"] = rs.result.regid;
                delete req.body["uid"];
                req.body['notification']["icon"] = "/firebase-logo.png";
                req.body['notification']["click_action"] = "http://localhost/html/FCM/web/social-login/";
                console.log(req.body);
                FIREBASE.sendNotification(req.body, function(body) {
                    res.status(200).json(body);
                });
            } else {
                if (rs.result.regid == '') {
                    var dd = req["me"].name + " Not Loggedin Any Device"
                    rs = { status: false, message: dd };
                }
                res.status(200).json(rs);
            }
        }, req.body["uid"]);
    },
    saveOrUpdate: function(req, res) {
        var self = this;
        FIREBASE.getByUidFromLocal(req, function(rs) {
            if (rs.status) {
                self._update(req, res, rs.result);
            } else {
                self.create(req, res);
            }
        }, req.body["uid"], req.body["email"]);
    }
};
