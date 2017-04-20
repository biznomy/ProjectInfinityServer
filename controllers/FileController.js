var FileModel = require('../models/FileModel.js');
var CONSTANT = require("../util/Constant.js");

module.exports = {

    list: function (req, res) {
        FileModel.find(function (err, Files) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting File.',
                    error: err
                });
            }
            return res.json(Files);
        });
    },

    show: function (req, res) {
        var id = req.params.id;
        FileModel.findOne({_id: id}, function (err, File) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting File.',
                    error: err
                });
            }
            if (!File) {
                return res.status(404).json({
                    message: 'No such File'
                });
            }
            return res.json(File);
        });
    },
    _create :function(data,cb){
        data.url = CONSTANT.SERVER_ADDRESS+data.url;        
      var File = new FileModel(data);
        File.save(function (err, File) {
            if (err) {
                cb(false,err);
            }
            cb(true,File);
        });
    },
    create: function (req, res) {
        var data ={
            name : req.body.name,
            type : req.body.type,
            size : req.body.size,
            url : req.body.url,
            created_by : req.body.created_by
        };
        this._create(data,function(s,r){
           if (!s){
                return res.status(500).json({
                    message: 'Error when creating File',
                    error: r
                });
            }
            return res.status(201).json(r);
        });
    },

 
    update: function (req, res) {
        var id = req.params.id;
        FileModel.findOne({_id: id}, function (err, File) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting File',
                    error: err
                });
            }
            if (!File) {
                return res.status(404).json({
                    message: 'No such File'
                });
            }

            File.name = req.body.name ? req.body.name : File.name;
			File.type = req.body.type ? req.body.type : File.type;
			File.size = req.body.size ? req.body.size : File.size;
			File.url = req.body.url ? req.body.url : File.url;
			File.created_by = req.body.created_by ? req.body.created_by : File.created_by;
			
            File.save(function (err, File) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating File.',
                        error: err
                    });
                }

                return res.json(File);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;
        FileModel.findByIdAndRemove(id, function (err, File) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the File.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
