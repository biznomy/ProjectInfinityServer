var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');


router.get('/suggestion/list', function(req, res) {
    UserController.suggestion(req, res);
});

router.get('/search', function(req, res) {
    UserController.search(req, res);
});

router.get('/:id', function(req, res) {
    UserController.show(req, res);
});

router.get('/user/uid/:uid', function(req, res) {
    UserController.getByUidFromFirebase(req, res);
});

router.post('/saveOrUpdate', function(req, res) {
    UserController.saveOrUpdate(req, res);
});

router.post('/push', function(req, res) {
    UserController.sendPushNotification(req, res);
});

router.post('/image/profile', function(req, res) {
    UserController.updateProfilePic(req, res);
});

router.post('/image/cover', function(req, res) {
    UserController.updateCoverPic(req, res);
});

module.exports = router;
