var multer = require("multer");

var FileUploader = {
    store: null,
    option:{
        destination: function(request, file, callback) {
            callback(null, 'uploads/');
        },
        filename: function(request, file, callback) {
            var n = Date.now() + "__" +file.originalname;
            callback(null, n);
        },
        onError:function(e){
          console.log(e);
        }
    },
    init: function() {
    	var self = this;
        self.store = multer({ "storage": multer.diskStorage(self.option)});
    }
};

FileUploader.init();

module.exports = FileUploader;