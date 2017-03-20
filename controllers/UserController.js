var UserModel = require('../models/UserModel.js'),
    FIREBASE = require('../firebase'),
    UserModel = require("../models/UserModel");;

module.exports = {

    list: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        UserModel.find().populate({ path: 'files', select: "_id name size url type" }).exec(function(err, Users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            return res.json(Users);
        });
    },

    show: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var id = req.params.id;
        UserModel.findOne({ _id: id }, function(err, User) {
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

    createNew:function(){

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

    _update: function(req,res, User) {
        User.dob = req.body.dob ? req.body.dob : User.dob;
        User.name = req.body.name ? req.body.name : User.name;
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
        FIREBASE.getByUidFromLocal(req,function(rs) {
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
        },req.body["uid"]);
    },
    saveOrUpdate:function(req,res) {
        var self = this;
        FIREBASE.getByUidFromLocal(req, function(rs) {
            if (rs.status) {
                self._update(req,res,rs.result);
            } else {
                self.create(req, res);
            }
        });
    }
};
