import React, { useState } from 'react';
import styles from './TweetInput.module.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth, storage, db } from '../firebase';
import { Avatar, Button, IconButton } from '@material-ui/core';
import { AddToPhotos } from '@material-ui/icons';
import firebase from 'firebase/app';

const TweetInput = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMeg] = useState('');

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = '';
    }
  };

  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweetImage) {
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('');

      const fileName = randomChar + '_' + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref('images')
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              db.collection('posts').add({
                username: user.displayName,
                avatar: user.photoUrl,
                text: tweetMsg,
                image: url,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        }
      );
    } else {
      db.collection('posts').add({
        username: user.displayName,
        avatar: user.photoUrl,
        text: tweetMsg,
        image: '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setTweetImage(null);
    setTweetMeg('');
  };

  return (
    <div>
      <Avatar
        className={styles.tweet_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await auth.signOut();
        }}
      />
    </div>
  );
};

export default TweetInput;
