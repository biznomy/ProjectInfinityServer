var multer = require("multer");
var fs = require('fs');
var FileUploader = {
    store: null,
    option:{
        destination: function(request, file, callback) {
            callback(null, 'uploads/');
        },
        filename: function(request, file, callback) {
            var n = Date.now() + "__" +file.originalname.split(' ').join('');
            callback(null, n);
        },
        onError:function(e){
          console.log(e);
        }
    },
    init: function() {
    	var self = this;
        self.store = multer({ "storage": multer.diskStorage(self.option), limits: {fileSize: 1000000, files:1}});
    },
    saveBase64: function(base64Data,path,cb) {
        if (!base64Data) {
            cb(false);
            return '';
        }
        var imgType = base64Data.split(";");
        imgType = imgType[0].split("/");
        imgType = imgType[imgType.length - 1];
        imgType = Date.now() + "." + imgType;
        base64Data = base64Data.replace(/^data:image\/(png|gif|jpeg|svg|webp);base64,/, '');
        
        fs.writeFile("store/"+path +"/"+ imgType, new Buffer(base64Data, 'base64'), function(err) {
            if(err) {
                cb(false,err);
            } else {
              cb(true,imgType,Buffer.byteLength(base64Data, 'utf8'));
            }
        });
    }
};

FileUploader.init();

module.exports = FileUploader;