import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import PostItem from '../Posts/PostItem';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItems from './CommentItems';

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, []);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      {' '}
      <Link to='/posts' className='btn'>
        Back to Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm id={post._id} />
      <div className='comments'>
        {post.comments.map(comment => (
          <CommentItems key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
