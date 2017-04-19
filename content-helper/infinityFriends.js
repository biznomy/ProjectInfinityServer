var DATABASE = "INFINITY";

var db = connect('127.0.0.1:27017/' + DATABASE);

print(' *** Connected With ' + DATABASE + ' Database *** ');

var USERS = db["users"],
    FRIENDS = db["friends"];

print(' *** Users == ' + USERS.count() + ' *** ');

var start = 400000,limit = USERS.count();

var Helper = {

    getRandomInt: function(min, max) {
        var r = Math.floor(Math.random() * (max - min + 1)) + min;
        return r;
    },
    init:function() {
        var q = USERS.find().skip(start).limit(limit);
        while (q.hasNext()) {
            start++;
            print("User " + start + " / " + limit);
            var user = q.next();
            Helper.createFriends(user);
        }
    },
    createFriends: function(user) {
        var frndBtwn = Helper.getRandomInt(1,6),
            self = this;
        print("Creating " + frndBtwn + " Friends  For " + user._id + " User");

        var sugtFrnds = USERS.find({ "_id": { "$ne": user._id } }).limit(frndBtwn).skip(_rand() * 2);
        while (sugtFrnds.hasNext()) {
            var sugtFrnd = sugtFrnds.next();
            if (self.isExist(user._id, sugtFrnd._id)) {
                print("Friend Already Exist");
            } else {
                print("New Friend Add");
                FRIENDS.insert({
                    'user1': user._id,
                    'user2': sugtFrnd._id,
                    'status': "friend"
                });
            }
        }
    },
    isExist: function(user1, user2) {
        var q = { "$or": [{ "$and": [{ "user1": user1 }, { "user2": user2 }] }, { "$and": [{ "user1": user2 }, { "user2": user1 }] }] };
        var data = FRIENDS.find(q);
        if (data & data.hasNext()) {
            return true;
        } else {
            return false;
        }
    }
};

Helper.init();
