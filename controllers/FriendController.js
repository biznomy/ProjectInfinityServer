var FriendModel = require('../models/FriendModel.js');

module.exports = {

    _find: function(req, query, cb, idd) {
        var page = req.query.page ? req.query.page - 1 : 0,
            limit = req.query.limit ? req.query.limit : 5,
            skip = page * limit;
        idd = "'" + idd + "'";
        FriendModel.find(query).populate({ path: 'user1', select: "_id name photoURL" })
            .populate({ path: 'user2', select: "_id name photoURL" }).skip(Number(skip)).limit(Number(limit)).exec(function(err, Friends) {
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
                        cb({ 'status': true, 'result': frnds, 'count': count });
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
        }, id);

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
            q = { "status": "request" };
        q[type] = id;
        this._find(req, q, function(r) {
            return res.status(200).json(r);
        }, id);
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
            friendId = req.params.friendId;
        var q = { "$or": [{ "$and": [{ "user1": id }, { "user2": friendId }] }, { "$and": [{ "user2": id }, { "user1": friendId }] }] };
        this._find(req, q, function(r) {
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
                    return res.status(201).json({
                        status: true,
                        message: 'Success',
                        result: Friend
                    });
                });
            } else {
                return res.status(200).json(r);
            }
        }, id);
    },

    unFriend: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }

        /* var id = req["me"]["__id"],
             q = { "$and": [{ "$or": [{ "user1": id }, { "user2": id }] }, { "status": "friend" }] };

         this._find(q, function(s, r) {
             if (s) {
                 return res.status(200).json({ status: s, result: r });
             } else {
                 return res.status(200).json({ status: s, result: r });
             }
         });*/

        var id = req.params.id;
        FriendModel.findByIdAndRemove(id, function(err, Friend) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Friend.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
