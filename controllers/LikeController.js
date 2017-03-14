var LikeModel = require('../models/LikeModel.js');
var PostModel = require('../models/PostModel.js');


module.exports = {

    getLikes: function(req, res) {
        if (req.error) {
            res.status(403).json(req.error);
            return;
        }
        LikeModel.find({ "post_id": req.params.postId }).populate({ path: 'user_id', select: "_id name photoURL" }).exec(function(err, Likes) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Like.',
                    error: err
                });
            }
            return res.status(200).json({ status: true, result: Likes });
        });
    },

    like: function(req, res) {
        if (req.error) {
            res.status(403).json(req.error);
            return;
        }
        this.isExist(req["me"]["__id"], req.params.postId, function(s, r) {
            if (s) {
                return res.status(200).json({
                    message: 'Like Successfully',
                    status: true
                });
            } else {
                var Like = new LikeModel({
                    user_id: req["me"]["__id"],
                    post_id: req.params.postId
                });

                Like.save(function(err, Like) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when set Like',
                            error: err
                        });
                    }
                    PostModel.findOne({ "_id": req.params.postId }, function(err, post) {
                        if (post) {
                            post.like_count++;
                            post.save();
                        }
                    });
                    return res.status(200).json({
                        message: 'Like Successfully',
                        status: true
                    });
                });
            }
        });
    },

    isExist: function(user_id, post_id, cb) {
        LikeModel.findOne({ user_id: user_id, post_id: post_id }, function(err, Like) {
            if (err) {
                cb(false, err);
            } else if (!Like) {
                cb(false, []);
            } else {
                cb(true, Like);
            }
        });
    },

    unlike: function(req, res) {
        if (req.error) {
            res.status(403).json(req.error);
            return;
        }
        var self = this;
        this.isExist(req["me"]["__id"], req.params.postId, function(s, r) {
            if (s) {
                self.remove(req, res, r._id);
            } else {
                return res.status(200).json({
                    message: 'Unlike Successfully',
                    status: true
                });
            }
        });
    },


    remove: function(req, res, id) {
        LikeModel.findByIdAndRemove(id, function(err, Like) {
            PostModel.findOne({ "_id": req.params.postId }, function(err, post) {
                if (post && post.like_count >= 1) {
                    post.like_count--;
                    post.save();
                }
            });
            return res.status(200).json({
                message: 'Unlike Successfully',
                status: true
            });
        });
    }

};
