var CommentModel = require('../models/CommentModel.js');
var FileUploader = require("../util/FileUploader");
var FileController = require("./FileController");
var PostModel = require('../models/PostModel.js');

module.exports = {

    list: function(req, res) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        CommentModel.find({ "post_id": req.params.commentId })
        .populate({ path: 'files', select: "_id name size url type" })
        .populate({ path: 'user_id', select: "_id name photoURL" }).exec(function(err, Comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Comments.',
                    error: err
                });
            }
            return res.status(200).json({ status: true, result: Comments });
        });
    },

    show: function(req, res) {
        var id = req.params.id;
        CommentModel.findOne({ _id: id }, function(err, Comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Comment.',
                    error: err
                });
            }
            if (!Comment) {
                return res.status(404).json({
                    message: 'No such Comment'
                });
            }
            return res.json(Comment);
        });
    },

    _create: function(req, res) {
        var Comment = new CommentModel({
            user_id: req["me"]["__id"],
            post_id: req.body.post_id,
            description: req.body.description,
            files: req.body.files,
            created_at: Date.now()
        });

        Comment.save(function(err, Comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Comment',
                    error: err
                });
            }
            PostModel.findOne({"_id":req.body.post_id},function(err, post) {
              if (post) {
                if(post.comments <= 3){
                    post.comments.shift();
                }
                post.comments.push(Comment._id);
                post.comment_count++;
                post.save();
              }
            });
            return res.status(201).json({status:true,result:Comment});
        });
    },

    findFileAndSave: function(req, res, cb) {
        if (req.error) {
            return res.status(403).json(req.error);
        }
        FileUploader.store.single('files')(req, res, function(err) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    result: err
                });
            }
            if (req.file && req.file != '') {
                var data = {
                    name: req.file.originalname,
                    type: req.file.mimetype,
                    size: req.file.size,
                    url: req.file.path,
                    created_by: req["me"]["__id"]
                };
                FileController._create(data, function(s, r) {
                    if (s) {
                        req.body.files = r._id;
                        cb(req, res);
                    } else {
                        return res.status(500).json({
                            status: false,
                            result: r
                        });
                    }
                });
            } else {
                cb(req, res);
            }
        });
    },

    create: function(req, res) {
        var self = this;
        self.findFileAndSave(req, res, function(a, b) {
            self._create(a, b);
        });
    },

    update: function(a, b) {
        var self = this;
        self.findFileAndSave(a, b, function(req, res) {
            var id = req.params.id;
            CommentModel.findOne({ _id: id }, function(err, Comment) {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        result: err
                    });
                }
                if (!Comment) {
                    return res.status(404).json({
                        status: false,
                        result: Comment
                    });
                }

                Comment.user_id = req.body.user_id ? req.body.user_id : Comment.user_id;
                Comment.post_id = req.body.post_id ? req.body.post_id : Comment.post_id;
                Comment.description = req.body.description ? req.body.description : Comment.description;
                Comment.files = req.body.files ? req.body.files : Comment.files;

                Comment.save(function(err, Comment) {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            result: err
                        });
                    }

                    return res.json(Comment);
                });
            });
        });
    },


    remove: function(req, res) {
        if (req.error) {
            res.status(403).json(req.error);
            return;
        }
        var id = req.params.id;
        CommentModel.findByIdAndRemove(id, function(err, Comment) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error when deleting the Comment.',
                    result: err
                });
            }
            return res.status(200).json({ status: true, result: [] });
        });
    }
};
