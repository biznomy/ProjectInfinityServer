var express = require('express');
var router = express.Router(),
    FIREBASE = require('../firebase');
var UserController = require('../controllers/UserController.js');


router.post('/', function (req, res) {
    FIREBASE.createNewUser(req.body,function(data){
        if(data.status){
           UserController.saveOrUpdate(req,res);
        }else{
          res.status(200).json(data);        	
        }
    });
});

module.exports = router;
