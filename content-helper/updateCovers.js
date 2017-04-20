var DATABASE = "INFINITY";

var db = connect('127.0.0.1:27017/' + DATABASE);

print(' *** Connected With ' + DATABASE + ' Database *** ');

var FILES = db["files"],
    GoogleImagesLink = db["googleImagesLink"];

var Helper = {
    getRandomInt: function(min, max) {
        var r = Math.floor(Math.random() * (max - min + 1)) + min;
        return r;
    },
    updateCovers:function(){
        var skip = 0,covers = FILES.find({type:"cover"}).skip(skip);
        while (covers.hasNext()){
            print( skip );
            var cover = covers.next();
            var cvrImgUrl = GoogleImagesLink.find().skip(Helper.getRandomInt(0,GoogleImagesLink.count() - 1 )).limit(1);
            cover["url"] = cvrImgUrl[0]["url"]
            FILES.update({ "_id": cover._id }, cover); 
            skip++;
        }
    }
};

Helper.updateCovers();
