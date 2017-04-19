var DATABASE = "INFINITY";

var db = connect('127.0.0.1:27017/' + DATABASE);

print(' *** Connected With ' + DATABASE + ' Database *** ');

var USERS = db["users"],
    POSTS = db["posts"],
    FILES = db["files"],
    GooglePlusPosts = db["googlePlusPosts"];

print(' *** Users == ' + USERS.count() + ' *** ');
print(' *** Posts == ' + POSTS.count() + ' *** ');
print(' *** Files == ' + FILES.count() + ' *** ');


var Helper = {

    getRandomInt: function(min, max) {
        var r = Math.floor(Math.random() * (max - min + 1)) + min;
        return r;
    },
    init: function() {
        var start = 0,
            limit = USERS.count();
        var q = USERS.find().limit(limit);
        while (q.hasNext()) {
            start++;
            print("User " + start + " / " + limit);
            var user = q.next();
            Helper.createPost(user);
        }
    },
    createPost: function(user) {
        var r = Helper.getRandomInt(1,7);
            print("Creating "+r+" Post For " +user._id);
        var q = GooglePlusPosts.find().limit(r).skip(_rand());
        while (q.hasNext()) {
            var GOOGLE_POST = q.next();
            if (GOOGLE_POST.img && GOOGLE_POST.img != "") {
                Helper.createFile(user, GOOGLE_POST.img, function(idd) {
                    var  year = Helper.getRandomInt(2000, 2016),
                     mnth = Helper.getRandomInt(1, 12),
                     day = Helper.getRandomInt(1,30);
                    var post = {
                        'description': GOOGLE_POST.des,
                        'files': idd,
                        'created_by': user._id,
                        'created_at': new Date(year,mnth,day),
                        'like_count': 0,
                        'comment_count': 0,
                        'comments': []
                    }
                    POSTS.insert(post);
                });
            }
        }
    },
    createFile: function(user, img, cb) {
        var file = {
            'name': "Google Plus",
            'type': "post",
            'size': 2000,
            'url': img,
            'created_by': user._id
        }
        var f = FILES.insert(file);
        if (f.nInserted == 1) {
            var f = FILES.find().limit(1).sort({ "_id": -1 });
            if (f[0]) {
                cb(f[0]._id);
            }
        }
    }
};

Helper.init();
