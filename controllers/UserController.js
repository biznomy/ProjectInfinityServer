var UserModel = require('../models/UserModel.js'),
    FIREBASE = require('../firebase'),
    FriendModel = require('../models/FriendModel.js'),
    UserModel = require("../models/UserModel"),
    FileUploader = require("../util/FileUploader");
var CONSTANT = require("../util/Constant.js");
var FileController = require("./FileController");

module.exports = {

    suggestion: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var myId = req["me"]["__id"],self = this;
        var q = { "$or": [{ "user1": myId }, { "user2": myId }] };

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
                    self._list(req, res, { "$nin": frnds },"suggestion");
                } else {
                    self._list(req, res, { "$ne": myId },"suggestion");
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
            limit = req.query.limit ? req.query.limit : 10,
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
    _list: function(req, res, ids,typ) {
         var page = req.query.page ? req.query.page - 1 : 0,
            limit = req.query.limit ? req.query.limit : 20,
            skip = page * limit;
        var select = "_id name photoURL email gender";
        var q ={ "_id": ids };
        UserModel.count(q,function(err,count){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Error when getting suggestion.',
                    error: err
                });
            }
            //count = count < 20?count:count - 20
            skip =  Math.floor(Math.random() * (count - 1 + 1)) + 1;
            UserModel.find(q).select(select).skip(Number(skip)).limit(Number(limit)).exec(function(err, suggestion) {
                if(err){
                    return res.status(500).json({
                        status: false,
                        message: 'Error when getting suggestion.',
                        error: err
                    });
                }
                UserModel.count(q).exec(function(e, count) {
                    return res.json({ 'status': true, 'result': suggestion, 'count': count ,type:typ});
                });
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

    _update: function(req, res, User,cb) {
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
        User.gender = req.body.gender ? req.body.gender : User.gender;
        User.cover = req.body.cover ? req.body.cover : User.cover;
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
            if(cb){
                cb(User);
            }else{
              return res.status(200).json({status:true,result:User});
            }
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
        if (req.error) {
            res.status(403).json(req.error);
            return;
        }
        FIREBASE.getByUidFromLocal(req, function(rs) {
            if (rs.status && rs.result.regid != '') {
                req.body["to"] = rs.result.regid;
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
        }, req["me"]["uid"],req["me"]["email"]);
    },
    saveOrUpdate: function(req, res) {
        if (req.error) {
            res.status(403).json(req.error);
            return;
        }
        var self = this;
        FIREBASE.getByUidFromLocal(req,function(rs) {
            if (rs.status) {
                self._update(req, res, rs.result);
            } else {
                self.create(req, res);
            }
        }, req["me"]["uid"],req["me"]["email"]);
    },
    updateProfilePic: function(req,res){
        var self = this;
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var self = this;
        FileUploader.saveBase64(req.body.base64,"profile", function(status,name,size) {
            if(status) {
                var newUrl = CONSTANT.SERVER_ADDRESS+"store/profile/"+name;
                var data = {
                    photoURL: newUrl,
                    uid:req["me"]["uid"]
                };
                FIREBASE.updateUser(data,function(s,r) {
                    if(s){
                        req.body["photoURL"] = newUrl;
                        FIREBASE.getByUidFromLocal(req, function(rs){
                            self._update(req, res, rs.result,function(){
                                return res.status(200).json({status:true,result:{photoURL:newUrl}});
                            });
                        }, r["uid"], r["email"]);
                    } else {
                        return res.status(500).json({
                            result: r,
                            status: s
                        });
                    }
                });
            } else {
                console.log(name);
                return res.status(500).json({
                    result: name,
                    status: status
                });
            }
        });
    },
    updateCoverPic: function(req,res){
        var self = this;
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var self = this;
        FileUploader.saveBase64(req.body.base64,"covers", function(status,name,size) {
            if (status) {
                var newUrl = CONSTANT.SERVER_ADDRESS+"store/covers/"+name;
                var data = {
                    name: name,
                    type: "covers",
                    size: size,
                    url: "store/covers/"+name,
                    created_by: req["me"]["__id"]
                };
                FileController._create(data, function(s, r) {
                    if (s) {
                        req.body["cover"] = r._id;
                        FIREBASE.getByUidFromLocal(req, function(rs){
                            self._update(req, res, rs.result,function(){
                                return res.status(200).json({status:true,result:{cover:newUrl}});
                            });
                        }, req["me"]["uid"], req["me"]["email"]);
                    }else {
                        return res.status(500).json({
                            message: 'Error when save cover',
                            status: false
                        });
                    }
                });
            }else{
                return res.status(500).json({
                    message: 'Error when save cover',
                    status: status,
                    result:name
                });
            }
        });
    }
};
