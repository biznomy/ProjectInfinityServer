var AdminModel = require('../models/UserModel.js');
var PostModel = require('../models/PostModel.js');
var LikeModel = require('../models/LikeModel.js');
var PostModel = require('../models/PostModel.js');
var CommentModel = require('../models/CommentModel.js');
var FIREBASE = require('../firebase.js');


/**
 * AdminController.js
 *
 * @description :: Server-side logic for managing Admins.
 */
module.exports = {

    /**
     * AdminController.list()
     */
    list: function(req, res) {
        AdminModel.find(function(err, Admins) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json(Admins);
        }).limit(20);
    },

    //LIKE

    likeCount: function(req, res) {
        LikeModel.count(function(err, count) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json({ "count": count });
        })
    },
    likeSearch: function(req, res) {
        console.log(req.params.id);
        LikeModel.count({ user_id: req.params.id }, function(err, count) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json({ "count": count });
        })
    },
    like: function(req, res) {
        LikeModel.find(function(err, data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json(data);
        }).limit(20);
    },


    // COMMENT

    commentCount: function(req, res) {
        CommentModel.count(function(err, count) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json({ "count": count });
        })
    },
    commentSearch: function(req, res) {
        console.log(req.params.id);
        CommentModel.count({ user_id: req.params.id }, function(err, count) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            CommentModel.find({ user_id: req.params.id }, function(err, data) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting Admin.',
                        error: err
                    });
                }
                return res.json({ "data": data, "count": count });
            }).limit(10)

        })
    },
    comment: function(req, res) {
        CommentModel.find(function(err, data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json(data);
        }).limit(20);
    },



    //POST 
    postCount: function(req, res) {
        PostModel.count(function(err, count) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json({ "count": count });
        })
    },
    postSearch: function(req, res) {
        console.log(req.params.id);
        PostModel.count({ user_id: req.params.id }, function(err, count) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            PostModel.find({ "created_by": req.params.id })
                .limit(10)
                .populate(['created_by', 'comments'])
                .exec(function(err, data) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting Admin.',
                            error: err
                        });
                    }
                    return res.json({ "data": data, "count": count });
                });

        })
    },
    post: function(req, res) {
        PostModel.find(function(err, data) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            PostModel.count(function(err, count) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting Admin.',
                        error: err
                    });
                }
                return res.json({ "data": data, "count": count });
            })

        }).limit(20).populate(['files']);
    },

    dashboard: function(req, res) {
        AdminModel.count(function(err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            PostModel.count(function(err, posts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting Admin.',
                        error: err
                    });
                }
                CommentModel.count(function(err, comments) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting Admin.',
                            error: err
                        });
                    }
                    LikeModel.count(function(err, likes) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when getting Admin.',
                                error: err
                            });
                        }
                        return res.json({ "totalUsersCount": users, "totalPostsCount": posts, "totalCommentsCount": comments, "totalLikesCount": likes });
                    })

                })

            })

        })
    },

    userInfo: function(req, res) {
        var _ids = req.params.id;
        var comms;
        var likes;
        var posts;
        CommentModel.count({ user_id: _ids }, function(err, count) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            console.log("postCount" + count)
            CommentModel.find({ user_id: _ids }, function(err, data) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting Admin.',
                        error: err
                    });
                }

                comm = { "data": data, "count": count }
                PostModel.count({ "created_by": _ids }, function(err, countP) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting Admin.',
                            error: err
                        });
                    }
                    PostModel.find({ "created_by": _ids })
                        .limit(10)
                        .populate(['files'])
                        .exec(function(err, dataP) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when getting Admin.',
                                    error: err
                                });
                            }
                            posts = { "data": dataP, "count": countP }

                            LikeModel.count({ user_id: req.params.id }, function(err, countL) {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Error when getting Admin.',
                                        error: err
                                    });
                                }
                                return res.json({ "posts": posts, "comments": comm, "likes": { "data": "", "count": countL } });

                            })
                        });

                })

            }).limit(5)

        })



    },
    userObj: function(req, res) {
        AdminModel.findOne({ _id: req.params.id }, function(err, Admins) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            return res.json(Admins);
        });
    },
    /**
     * AdminController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        AdminModel.findOne({ _id: id }, function(err, Admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin.',
                    error: err
                });
            }
            if (!Admin) {
                return res.status(404).json({
                    message: 'No such Admin'
                });
            }
            return res.json(Admin);
        });
    },

    /**
     * AdminController.create()
     */
    create: function(req, res) {
        var Admin = new AdminModel({});

        Admin.save(function(err, Admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Admin',
                    error: err
                });
            }
            return res.status(201).json(Admin);
        });
    },

    /**
     * AdminController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        AdminModel.findOne({ _id: id }, function(err, Admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Admin',
                    error: err
                });
            }
            if (!Admin) {
                return res.status(404).json({
                    message: 'No such Admin'
                });
            }


            Admin.save(function(err, Admin) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Admin.',
                        error: err
                    });
                }

                return res.json(Admin);
            });
        });
    },

    /**
     * AdminController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        AdminModel.findByIdAndRemove(id, function(err, Admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Admin.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
    searchUser: function(req, res) {
        var q = req.query;
        var mycount = 0;
        var query = { $text: { $search: q.text } }
        console.log(query)
        if (q.model.indexOf("use") > -1) {
            AdminModel.find(query, function(err, data) {
                if (err) {
                    return res.status(400).json(err);
                }
                AdminModel.count(query, function(err, count) {
                    mycount = count;
                    return res.status(200).json({ data: data, count: mycount });
                });
            }).limit(10)
        } else if (q.model.indexOf("pos") > -1) {
            PostModel.find(query, function(err, data) {
                if (err) {
                    return res.status(400).json(err);
                }
                PostModel.count(query, function(err, count) {
                    mycount = count;
                    return res.status(200).json({ data: data, count: mycount });
                });
            }).limit(10)
        } else {
            return res.status(400).json({ "message": "No model defined" });
        }


    },
    updateUserDetail: function(req, res) {

        AdminModel.findByIdAndUpdate(req.params.id, req.body, {new : true}, function(err, data){
            if (err) {
                return res.status(500).json({
                    message: 'Error when updating User.',
                    error: err
                });
            }

            return res.json(data);
        });       
        
    }
};
