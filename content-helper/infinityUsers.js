var DATABASE = "INFINITY";

var db = connect('127.0.0.1:27017/' + DATABASE);

print(' *** Connected With ' + DATABASE + ' Database *** ');

var USERS = db["twitterUsers"],
    HOBBIES = db["hobbies"].find(),
    RANDOMUSERS = db["randomUsers"],
    INFINITYUSERS = db["users"],
    FILES = db["files"],
    GoogleImagesLink = db["googleImagesLink"];

var Helper = {
    onlineUserBelong: [
        { loc: "delhi", lat: 28.62771926337146, long: 77.22179786426756, km: 30 },
        { loc: "noida", lat: 28.535068049542353, long: 77.41241455078125, km: 20 },
        { loc: "chandigarh", lat: 30.736524153326393, long: 76.77932739257812, km: 10 }
    ],
    getRandomInt: function(min, max) {
        var r = Math.floor(Math.random() * (max - min + 1)) + min;
        return r;
    },
    getRandomHobbies: function() {
        var r = Helper.getRandomInt(1, 10),
            f = [];
        for (var i = 0; i < r; i++) {
            var h = HOBBIES[Helper.getRandomInt(1, 50)];
            f.push(h.name);
        }
        return f;
    },
    genrateUser: function() {
        var start = 0,
            limit = USERS.count();
        var result1 = USERS.find().skip(start).limit(limit);
        while (result1.hasNext()) {
            start++;
            print("Create User " + start + " / " + limit);
            var nxt1 = result1.next();
            var result2 = RANDOMUSERS.find().limit(1).skip(_rand()*);
            var nxt2 = result2[0],
                no = Helper.getRandomInt(0, Helper.onlineUserBelong.length - 1);
            var crntLoc = Helper.onlineUserBelong[no];
            var cvrImgUrl = GoogleImagesLink.find().skip(Helper.getRandomInt(0, GoogleImagesLink.count()-1)).limit(1);
            Helper.createFile(cvrImgUrl[0].url, function(idd) {
                var u = {
                    'dob': nxt2.dob,
                    'name': nxt1.name,
                    'bio': nxt1.bio,
                    'photoURL': nxt1.img,
                    'uid': null,
                    'phone': nxt2.phone,
                    'email': nxt1.username + "@gmail.com",
                    'address1': null,
                    'city': nxt2.location.city,
                    'state': nxt2.location.state,
                    'country': nxt2.country,
                    'pincode': nxt2.location.postcode,
                    'cover': idd,
                    'regid': null,
                    'gender': nxt2.gender,
                    'hobbies': Helper.getRandomHobbies(),
                    'currentLocation': Helper.generateLatLong(crntLoc.lat, crntLoc.long, crntLoc.km)
                }
                INFINITYUSERS.insert(u);
            });
        }
    },
    generateLatLong: function(latitude, longitude, radiusInKM) {
        var radiusInMeters = radiusInKM * 1000;
        var getRandomCoordinates = function(radius, uniform) {
            var a = Math.random(),
                b = Math.random();
            if (uniform) {
                if (b < a) {
                    var c = b;
                    b = a;
                    a = c;
                }
            }
            return [
                b * radius * Math.cos(2 * Math.PI * a / b),
                b * radius * Math.sin(2 * Math.PI * a / b)
            ];
        };
        var randomCoordinates = getRandomCoordinates(radiusInMeters, true);
        // Earths radius in meters via WGS 84 model.
        var earth = 6378137;
        // Offsets in meters.
        var northOffset = randomCoordinates[0],
            eastOffset = randomCoordinates[1];

        // Offset coordinates in radians.
        var offsetLatitude = northOffset / earth,
            offsetLongitude = eastOffset / (earth * Math.cos(Math.PI * (latitude / 180)));

        // Offset position in decimal degrees.
        var loc =[];
        loc.push(longitude + (offsetLongitude * (180 / Math.PI)));
        loc.push(latitude + (offsetLatitude * (180 / Math.PI)));
        return {"coordinates":loc,"type":"Point"};
    },
    getLatLong: function(lat, long, cntr, radiusInKM) {
        var result = [];
        for (var i = 0; i < cntr.length; i++) {
            var r = this.generateLatLong(lat, long, radiusInKM);
            result.push(r);
        }
        return result;
    },
    createFile: function(img, cb) {
        var file = {
            'name': "Google",
            'type': "cover",
            'size': 2000,
            'url': img,
            'created_by': null
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

Helper.genrateUser();

/*db.users.find(
   {
     currentLocation:
       { $near :
          {
            $geometry: { type: "Point",  coordinates: [ 77.4935022978285,28.570971945481244 ] },
            $minDistance: 100,
            $maxDistance: 1000
          }
       }
   }
)*/

//var cvrImgUrl = db.googleImagesLink.find().skip(Helper.getRandomInt(0, db.googleImagesLink.count()-1)).limit(1);
