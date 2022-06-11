import React, { useState, useEffect } from 'react';
import styles from './Post.module.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { db } from '../firebase';
import firebase from 'firebase/app';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { MessageOutlined, SendOutlined } from '@material-ui/icons';

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
  const { data } = props;
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
      </div>
    </div>
  );
};

export default Post;
