var express = require('express');
var router = express.Router();
var LikeController = require('../controllers/LikeController.js');


router.get('/:postId/list',function(req, res){LikeController.getLikes(req, res)});

router.get('/:postId/set',function(req, res){LikeController.like(req, res)});

router.get('/:postId/unset',function(req, res){LikeController.unlike(req, res)});

module.exports = router;
