import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import TweetInput from './TweetInput';
import styles from './Feed.module.css';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: '',
      username: '',
      avatar: '',
      image: '',
      text: '',
      timestamp: null,
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
          }))
        )
      );
    return () => {
      unSub();
    };
  }, []);

  return (
    <div className={styles.feed}>
      Feed
      <TweetInput />
      {posts.map((post) => (
        <p>{post.id}</p>
      ))}
    </div>
  );
};

export default Feed;
