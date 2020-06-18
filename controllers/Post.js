const { validationResult } = require('express-validator');

const Post = require('../model/Post');
const User = require('../model/User');

exports.postCreatePost = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const user = await User.findOne({ _id: req.userId }).select('-password');

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: user._id,
    });

    await newPost.save();

    res.json(newPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      return res.status(404).json({ msg: 'posts not found' });
    }
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.getSingalPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.Id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'objectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.deleteSingalPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.Id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    const user = await User.findById(req.userId);
    if (post.user.toString() !== req.userId) {
      return res
        .status(401)
        .json({ msg: 'user not autherized to delete this post' });
    }
    await post.remove();
    res.json({ msg: 'post Deleted' });
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'objectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.getLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.Id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    if (
      post.likes.filter(like => like.user.toString() === req.userId).length > 0
    ) {
      return res.status(400).json({ msg: 'post is already liked !' });
    }
    post.likes.unshift({ user: req.userId });

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'objectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.getUnlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.Id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    if (
      post.likes.filter(like => like.user.toString() === req.userId).length ===
      0
    ) {
      return res.status(400).json({ msg: 'post has not yet been unliked !' });
    }

    post.likes = post.likes.filter(
      likes => likes.user.toString() !== req.userId
    );

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'objectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.putCommentUser = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const user = await User.findOne({ _id: req.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'user not found' });
    }

    const comment = {
      text: req.body.text,
      avatar: user.avatar,
      name: user.name,
      user: user._id,
    };

    const post = await Post.findById(req.params.Id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }

    post.comments.unshift(comment);

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUserComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.Id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (
      post.comments.filter(comment => comment.user.toString() === req.userId)
        .length === 0
    ) {
      return res
        .status(401)
        .json({ msg: 'User is not authorized to delete this comment !' });
    }
    post.comments = post.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};
