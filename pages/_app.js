import Loading from '@/components/Loading';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);

  /// CHANGE STATUS WHEN USER LOGS IN
  useEffect(() => {
    ( async() => {
      
      if (user) {
        
        await setDoc(doc(db, `users`, user.uid), {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL
        }, {merge: true})
    }
      
    })();
  }, [user])

  if (loading) return <Loading />
  if (!user) return <Login />

  return <Component {...pageProps} />
}
