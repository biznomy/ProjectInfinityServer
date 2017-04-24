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
        var skip = 0,posts = FILES.find({type:"post"}).skip(skip);
        while (posts.hasNext()){
            print( skip );
            var post = posts.next();
            var cvrImgUrl = GoogleImagesLink.find().skip(Helper.getRandomInt(0,GoogleImagesLink.count() - 1 )).limit(1);
            post["url"] = cvrImgUrl[0]["url"]
            FILES.update({ "_id": post._id }, post); 
            skip++;
        }
    }
};

Helper.updateCovers();
