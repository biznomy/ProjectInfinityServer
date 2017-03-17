var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');


router.get('/', function(req, res) {
    UserController.list(req, res);
});

router.get('/:id', function(req, res) {
    UserController.show(req, res);
});

/*router.post('/', function (req, res) {
    UserController.create(req, res);
});*/

router.get('/user/uid/:uid', function(req, res) {
    UserController.getByUidFromFirebase(req, res);
});

router.post('/saveOrUpdate', function(req, res) {
    UserController.saveOrUpdate(req, res);
});

router.post('/push', function(req, res) {
    UserController.sendPushNotification(req, res);
});

module.exports = router;
