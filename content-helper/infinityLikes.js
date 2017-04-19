var DATABASE = "INFINITY";

var db = connect('127.0.0.1:27017/' + DATABASE);

print(' *** Connected With ' + DATABASE + ' Database *** ');

var USERS = db["users"],
    POSTS = db["posts"],
    LIKES = db["likes"],
    FRIENDS = db["friends"];

print(' *** Users == ' + USERS.count() + ' *** ');
print(' *** Posts == ' + POSTS.count() + ' *** ');

var start = 200000,
    limit = POSTS.count();

var Helper = {

    getRandomInt: function(min, max) {
        var r = Math.floor(Math.random() * (max - min + 1)) + min;
        return r;
    },
    init: function() {
        var q = POSTS.find().skip(start).limit(limit);
        Helper.createComment(q);
    },
    createComment: function(q) {
        if (q.hasNext()) {
            start++;
            print("User " + start + " / " + limit);
            var post = q.next();
            var r = Helper.getRandomInt(1, 5);
            var postAdmin = post.created_by,
                query = { $or: [{ user1: postAdmin }, { user2: postAdmin }] };
            var likers = FRIENDS.find(query).limit(r).skip(_rand());
            print("Creating Likes  For " + post._id + " Post");
            try {
                while (likers.hasNext()) {
                    var liker = likers.next();

                    var like = {
                        'user_id': liker.user2,
                        'post_id': post._id
                    };

                    var chkEst = LIKES.find(like).count();
                    if (chkEst < 1) {
                        var f = LIKES.insert(like);
                        if (f.nInserted == 1) {
                            var tmpPst = POSTS.findOne({ "_id": post._id });
                            tmpPst.like_count++;
                            POSTS.update({ "_id": post._id }, tmpPst);
                        }
                    }
                }
                Helper.createComment(q);
            } catch (e) {
                 print("================================");
                 print("*******************************");
                 print(e);
                 start =  start + 10;
                 Helper.init();
            }
        }
    }
};

Helper.init();
