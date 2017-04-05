var FriendModel = require('../models/FriendModel.js');

module.exports = {

    _find: function(req, query, cb, idd,type) {
        var page = req.query.page ? req.query.page - 1 : 0,
            limit = req.query.limit ? req.query.limit : 10,
            skip = page * limit;
        idd = "'" + idd + "'";
        var select = "_id name photoURL email gender";
        FriendModel.find(query).populate({
            path: 'user1',
            select: select,
            model: "User",
            populate: { path: 'cover', select: "_id url", model: "File" }
        }).populate({
            path: 'user2',
            select: select,
            model: "User",
            populate: { path: 'cover', select: "_id url", model: "File" }
        }).skip(Number(skip)).limit(Number(limit)).sort({ "_id": -1 }).exec(function(err, Friends) {
            if (err) {
                cb(false, Friends);
            } else {
                var frnds = Friends.map(function(f) {
                    var s1 = "'" + f.user1._id + "'",
                        s2 = "'" + f.user2._id + "'";
                    if (idd == s1) {
                        return f.user2;
                    } else {
                        return f.user1;
                    }
                });
                FriendModel.count(query).exec(function(e, count) {
                    cb({ 'status': true, 'result': frnds, 'count': count ,'type':type});
                });
            }

        });
    },

    _findById: function(id, cb) {
        FriendModel.findOne({ _id: id }, function(err, Friend) {
            if (err) {
                cb(false, err);
            } else if (!Friend) {
                cb(false, []);
            } else {
                cb(true, Friend);
            }
        });
    },

    friends: function(req, res) {

        if (req.error) {
            return res.status(403).json(req.error);
        }

        var id = req["me"]["__id"],
            q = { "$and": [{ "$or": [{ "user1": id }, { "user2": id }] }, { "status": "friend" }] };

        this._find(req, q, function(r) {
            return res.status(200).json(r);
        }, id,"friend");

    },

    blockList: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var id = req["me"]["__id"];
        this._find(req, { "$and": [{ "$or": [{ "user1": id }, { "user2": id }] }, { "status": "block" }] }, function(r) {
            return res.status(200).json(r);
        }, id);
    },

    getRequests: function(req, res, type) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var id = req["me"]["__id"],
            q = { "status": "request"};
        q[type] = id;
        var typ = "requestOut"
        if (type == "user2"){ typ = "requestIn" }
        this._find(req, q, function(r) {
            return res.status(200).json(r);
        },id,typ);
    },

    blockOrAccept: function(req, res, type) {
        if (req.error) {
            return res.status(403).json(req.error);
        }

        var self = this,
            id = req.params.id,
            frinedID = req.params.frinedID;

        self._findById(id, function(s, r) {
            if (s) {
                var id = req["me"]["__id"];
                if (r.user2.toString() == id.toString()) {
                    r.status = type;
                    r.save();
                    return res.status(200).json({ status: s, result: r });
                } else {
                    return res.status(200).json({ status: false, message: "Not Authorized" });
                }
            } else {
                return res.status(200).json({ status: s, result: r });
            }
        });
    },

    senReq: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }

        var id = req["me"]["__id"],
            self = this,
            friendId = req.params.friendId;
        FriendModel.count({ "user1": id, "status": "request" },
            function(err, count) {
                if (count <= 10) {
                    var q = { "$or": [{ "$and": [{ "user1": id }, { "user2": friendId }] }, { "$and": [{ "user2": id }, { "user1": friendId }] }] };
                    self._find(req, q, function(r) {
                        if (r.status && r.result.length == 0) {
                            var Friend = new FriendModel({
                                user1: id,
                                user2: friendId,
                                status: "request"
                            });

                            Friend.save(function(err, Friend) {
                                if (err) {
                                    return res.status(500).json({
                                        status: false,
                                        message: 'Error when creating new Friend',
                                        error: err
                                    });
                                }
                                return res.status(200).json({
                                    status: true,
                                    message: 'Success',
                                    result: Friend
                                });
                            });
                        } else {
                            return res.status(200).json(r);
                        }
                    }, id);
                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Your Friend Request was not sent because the Request limit was reached. Please try again later',
                        result: []
                    });
                }
            });
    },

    unFriend: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        var id = req["me"]["__id"],
            frienId = req.params.friendId,
            q = { "$and": [{ "status": "friend" }, { "$or": [{ "user2": id, "user1": frienId }, { "user2": frienId, "user1": id }] }] };
        FriendModel.remove(q, function(err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Friend.',
                    result: err,
                    status: false
                });
            }
            return res.status(200).json({ status: true, result: {} });
        });
    }
};
