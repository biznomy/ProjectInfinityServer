var express = require('express');
var router = express.Router(),
    FIREBASE = require('../firebase');


router.post('/', function (req, res) {
    FIREBASE.createNewUser(req.body,function(data){
        res.status(200).json(data);
    });
});

module.exports = router;
