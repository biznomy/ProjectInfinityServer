var express = require('express');
var router = express.Router();
var FriendController = require('../controllers/FriendController.js');

router.get('/:friendId/request', function (req, res) {
    FriendController.senReq(req, res);
});

router.get('/:friendId/unfriend/:id', function (req, res) {
    FriendController.unFriend(req,res,"unfriend");
});

router.get('/:friendId/block/:id', function (req, res) {
    FriendController.blockOrAccept(req,res,"block");
});

router.get('/:friendId/accept/:id', function (req, res) {
    FriendController.blockOrAccept(req,res,"friend");
});

router.get('/list', function (req, res) {
    FriendController.friends(req, res);
});

router.get('/block/list', function (req, res) {
    FriendController.blockList(req, res);
});

router.get('/request/in/list', function (req, res) {
    FriendController.getRequests(req, res,"user2");
});

router.get('/request/out/list', function (req, res) {
    FriendController.getRequests(req, res,"user1");
});


module.exports = router;
