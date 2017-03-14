var express = require('express');
var router = express.Router();
var FileController = require('../controllers/FileController.js');


router.get('/', function (req, res) {
    FileController.list(req, res);
});


router.get('/:id', function (req, res) {
    FileController.show(req, res);
});

router.post('/', function (req, res) {
    FileController.create(req, res);
});

router.put('/:id', function (req, res) {
    FileController.update(req, res);
});

router.delete('/:id', function (req, res) {
    FileController.remove(req, res);
});

module.exports = router;
