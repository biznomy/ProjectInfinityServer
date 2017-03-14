var express = require('express');
var router = express.Router();
var CommentController = require('../controllers/CommentController.js');

router.get('/:commentId/list', function (req, res){CommentController.list(req, res);});

router.post('/save', function (req, res) {CommentController.create(req, res);});

router.put('/:id', function (req, res) {CommentController.update(req, res);});

router.get('/:id/delete',function (req, res) {CommentController.remove(req, res);});

module.exports = router;
