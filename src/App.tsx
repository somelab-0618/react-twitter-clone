import React, { useEffect } from 'react';
import styles from './App.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, login, logout } from './features/userSlice';
import { auth } from './firebase';
import Feed from './components/Feed';
import Auth from './components/Auth';

const App: React.FC = () => {
  // Reduxのstateからuserのstateを参照する
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // firebaseでのユーザーの状態を監視する関数
    // 戻り値は監視を解除する関数。
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    // コンポーネントがアンマウントされる時は監視を解除
    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <>
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
