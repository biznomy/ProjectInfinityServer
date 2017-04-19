var fs = require('fs'),
    request = require('request');
var CONSTANT = require("../util/Constant");
var mongoose = require("mongoose");
mongoose.connect(CONSTANT.MONGO_SERVER);
var UserModel = require('../models/UserModel.js');
var FileModel = require('../models/FileModel.js');

var IMAGE = {
	path:"../store/profile/",
    save: function(img,cb) {
       if(img.startsWith("http")){
          IMAGE.download(img,cb);
       }else{
          IMAGE.saveBase64(img,cb);
       }
    },
    saveBase64: function(base64Data,cb) {
        var imgType = base64Data.split(";");
        imgType = imgType[0].split("/");
        imgType = imgType[imgType.length - 1];
        imgType = Date.now() + "." + imgType;
        base64Data = base64Data.replace(/^data:image\/(png|gif|jpeg);base64,/, '');
        fs.writeFile(IMAGE.path + imgType, new Buffer(base64Data, 'base64'), function(err) {
            if (err) {
                cb(false);
            } else {
              cb(true,imgType);
            }
        });
    },
    download: function(url,cb) {
        request.head(url, function(err, res, body) {
        	if(err){
        		console.log(err);
        		cb(false);
        	}else{
        		var imgType = res.headers['content-type'];
	            imgType = imgType.split("/");
	            imgType = imgType[imgType.length - 1];
	            imgType = imgType.toLowerCase();
	            if("jpeg gif jpg png".match(imgType)){
	            	imgType = Date.now() + "." + imgType;
		            request(url).pipe(fs.createWriteStream(IMAGE.path + imgType)).on('close',function(){
		               cb(true,imgType);
		            }).on('error',function(){
		               cb(false);
		            });
	            }else{
	            	console.log("content-type  error " + imgType);
	            	cb(false);
	            }
        	}
            
        });
    },
    saveUserProfile:function(imgess,index){
    	IMAGE.path ="../store/profile/";
    	index = index?index:0;
        if(imgess.length > index){
        	IMAGE.save(imgess[index].photoURL,function(status,name){
        	   console.log(index + " == "+ status );
        	   if(status){
        	   	 UserModel.findOne({"_id":imgess[index]["_id"]},function(err,User){
    	   	 	    if (err) {
		              console.log('Error when getting User');
		            }
		            if (!User) {
		                console.log('No such User')
		            }

		            User["photoURL"] = CONSTANT.SERVER_ADDRESS+"store/profile/"+name;
		            
		            User.save(function(){
		            	index++;
		            	IMAGE.saveUserProfile(imgess,index);
		            });
        	   	 });
        	   }else{
        	   	console.log("error ====");
        	   	index++;
        	   	IMAGE.saveUserProfile(imgess,index);
        	   }
               
        	});
        }
    },
    saveUserCover:function(imgess,index){
    	IMAGE.path ="../store/covers/";
    	index = index?index:0;
        if(imgess.length > index){
        	IMAGE.save(imgess[index].url,function(status,name){
        	   console.log(index + " == "+ status );
        	   if(status){
        	   	 FileModel.findOne({"_id":imgess[index]["_id"]},function(err,File){
    	   	 	    
    	   	 	    if (err) {
		               console.log('Error when getting File');
		            }
		            if (!File) {
		               console.log('No such File')
		            }

		            FileModel["url"] = CONSTANT.SERVER_ADDRESS+"store/covers/"+name;
		            
		            File.save(function(){
		            	index++;
		            	IMAGE.saveUserCover(imgess,index);
		            });
        	   	 });
        	   }else{
	        	   	console.log("error ====");
	        	   	index++;
	        	   	IMAGE.saveUserCover(imgess,index);
        	   }
               
        	});
        }
    }
};

//IMAGE.saveMultiple([],0);

/*FileModel.find({type:"cover"}).skip(1).limit(9).exec(function(err,data){
	if(data){
		IMAGE.saveUserCover(data,0);
	}
});*/

/*UserModel.find().skip(0).limit(10).exec(function(err,data){
	if(data){
		IMAGE.saveUserProfile(data,0);
	}
});*/