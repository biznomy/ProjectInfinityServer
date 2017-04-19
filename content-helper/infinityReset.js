var DATABASE = "INFINITY",
    COLLECTIONS = {
        TEMP: ["twitterUsers", "hobbies", "googlePlusPosts", "googleImagesLink", "randomUsers"],
        FINAL: ["users", "posts", "likes", "comments", "friends", "files"]
    };

var db = connect('127.0.0.1:27017/' + DATABASE);

/* drop  all collections */
var Helper = {
    dropCollections: function(type) {
        var cltns = COLLECTIONS[type];
        for (var i = 0; i < cltns.length; i++) {
            var cltn = db[cltns[i]];
            if (cltn && cltn != "twitterUsers") {
                cltn.drop();
            }
        }
        print(' >>> Drop all exist ' + type + " collections");
    },
    createCollections: function(type) {
        var cltns = COLLECTIONS[type];
        for (var i = 0; i < cltns.length; i++) {
            db.createCollection(cltns[i]);
        }
        print(' >>> Create all ' + type + " collections");
    }
}

//Helper.dropCollections("TEMP");
//Helper.dropCollections("FINAL");

//Helper.createCollections("TEMP");

var hobs = db.hobbies.count();
if (hobs < 1) {
    var hobbies = ["Amateur radio", "Audiophilia", "Aquarium", "Baking", "Baton twirling", "Bonsai", "Computer programming", "Cooking", "Creative writing", "Dance", "Drawing", "Basketball", "Genealogy", "Home automation", "Home movies", "Jewelry", "Knapping", "Lapidary", "Locksport", "Musical instruments", "Painting", "Knitting", "Scrapbooking", "Sculpting", "Sewing", "Singing", "Woodworking", "Air sports", "Board sports", "Cycling", "Freerunning", "Jogging", "Kayaking", "Motor sports", "Mountain biking", "Machining", "Parkour", "pet", "Photography", "Rock climbing", "Running", "Sailing", "Sand castle", "Sculling", "Rowing", "Surfing", "Swimming", "Tai chi chuan", "Vehicle restoration", "Water sports", "Yoga"];

    var bulk = db["hobbies"].initializeUnorderedBulkOp();

    for (var i = 0; i < hobbies.length; i++) {
        bulk.insert({ "name": hobbies[i] });
    }

    bulk.execute();
}

var tuc = db.twitterUsers.count();
if (tuc < 1) {
    db.getSiblingDB('TWITTER')['users'].find().forEach(function(d) {
        print("............");
        db.twitterUsers.insert(d);
    });
}
