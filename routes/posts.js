const express = require('express');
const { check } = require('express-validator');

const auth = require('../middleware/is-auth');
const postController = require('../controllers/Post');

const router = express.Router();

//Post//api/post  To create the post for the user
router.post(
  '/',
  [auth, [check('text', 'text is required').notEmpty()]],
  postController.postCreatePost
);

//Get//api/post  To get all the posts
router.get('/', auth, postController.getAllPosts);

//DELETE//api/post/:Id to delete the user post
router.delete('/:Id', auth, postController.deleteSingalPost);

//GET //api/post/:Id to get singal post by id
router.get('/:Id', auth, postController.getSingalPost);

//PUT //api/post/like/:Id to like the post of the user
router.put('/like/:Id', auth, postController.getLikePost);

//PUT //api/post/unlike/:Id to unlike the post of the user
router.put('/unlike/:Id', auth, postController.getUnlikePost);

//PUT //api/post/comment/:Id to comment on the user  post
router.put(
  '/comment/:Id',
  [auth, [check('text', 'text is required').notEmpty()]],
  postController.putCommentUser
);

//Delete //api/post/comment/:Id/:commentId to delete the user comment
router.delete(
  '/comment/:Id/:commentId',
  auth,
  postController.deleteUserComment
);
module.exports = router;
