var DATABASE = "TWITTER",
    COLLECTION = "users";

var db = connect('127.0.0.1:27017/' + DATABASE);

print(' *** Connected With ' + DATABASE + ' Database && ' + COLLECTION + ' Collection *** ');

var count = db[COLLECTION].count();
print(' >>> Total User == ' + count);

var TABLE = db[COLLECTION];

var Helper = {
    getRandomInt: function(min, max) {
        var r = Math.floor(Math.random() * (max - min + 1)) + min;
        return r;
    },
    getRandomUsers: function(id) {
        var r = Helper.getRandomInt(1, 400),
            f = [];
        var q = TABLE.find({ "_id": { $ne: id } }, { "name": 1 }).limit(r).skip(_rand() * count);
        while (q.hasNext()) {
            var nxt = q.next();
            f.push(nxt);
            if (!q.hasNext()) {
                return f;
            }
        }
    },
}


TABLE.find().limit(100000).forEach(function(user) {
    print(user._id);
    user["followers"] = []; //Helper.getRandomUsers(user._id)
    user["following"] = []; //Helper.getRandomUsers(user._id)

    TABLE.update({ "_id": user._id }, user);

});

print(' *** Setup Users Followers and Following *** ');
