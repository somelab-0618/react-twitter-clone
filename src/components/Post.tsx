import React, { useState, useEffect } from 'react';
import styles from './Post.module.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { db } from '../firebase';
import firebase from 'firebase/app';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

interface PROPS {
  data: {
    id: string;
    username: string;
    avatar: string;
    text: string;
    image: string;
    timestamp: any;
  };
}

const Post: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser); // ログインしているユーザー
  const { data } = props;
  const [comment, setComment] = useState('');
  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection('posts').doc(data.id).collection('comments').add({
      username: user.displayName,
      avatar: user.photoUrl,
      text: comment,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };
  return (
    <div className={styles.post}>
      <div className={styles.avatar}>
        <Avatar src={data.avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{data.username}</span>
              <span className={styles.post_headerTime}>
                {new Date(data.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{data.text}</p>
          </div>
        </div>
        {data.image && (
          <div className={styles.post_tweetImage}>
            <img src={data.image} alt='tweet' />
          </div>
        )}
        <form onSubmit={newComment}>
          <div className={styles.post_form}>
            <input
              className={styles.post_input}
              type='text'
              placeholder='Type new comment...'
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
            />
            <button
              type='submit'
              className={comment ? styles.post_button : styles.post_buttonDisable}
            >
              <SendIcon className={styles.post_sendIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
