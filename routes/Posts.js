var express = require('express');
var router = express.Router();
var PostController = require('../controllers/PostController.js');


router.get('/timeline', function(req, res) {
    PostController.timeline(req, res);
});

router.get('/wall', function(req, res) {
    PostController.wall(req, res);
});

router.get('/:id', function(req, res) { PostController.show(req, res); });

router.post('/', function(req, res) { PostController.create(req, res); });

router.put('/:id', function(req, res) { PostController.update(req, res); });

router.get('/:id/delete', function(req, res) { PostController.remove(req, res); });

module.exports = router;
