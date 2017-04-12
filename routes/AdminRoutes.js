var express = require('express');
var router = express.Router();
var AdminController = require('../controllers/AdminController.js');

//User
router.get('/', AdminController.list);
router.get('/user/list', AdminController.list);



//Like
router.get('/like/count', AdminController.likeCount);

router.get('/like/count/:id', AdminController.likeSearch);

router.get('/like', AdminController.like);


//Post
router.get('/post/count', AdminController.postCount);

router.get('/post/user/:id', AdminController.postSearch);

router.get('/post', AdminController.post);


//Comment
router.get('/comment/count', AdminController.commentCount);

router.get('/comment/count/:id', AdminController.commentSearch);

router.get('/comment', AdminController.comment);

/*
 * PUT
 */
router.put('/:id', AdminController.update);
/*
 * DELETE
 */
router.delete('/:id', AdminController.remove);

router.get('/search/user' ,AdminController.searchUser);

module.exports = router;
