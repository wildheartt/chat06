import React, { useRef, useState } from 'react';
import './app.css';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDYPTm3wcEtMRoydTMy-XgNx5KojVoPgbw',
  authDomain: 'chat-cc6fc.firebaseapp.com',
  projectId: 'chat-cc6fc',
  storageBucket: 'chat-cc6fc.firebasestorage.app',
  messagingSenderId: '224147244391',
  appId: '1:224147244391:web:525b1f6c4f2ad9ab889bc2',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Зарегестрироваться с Google
      </button>
      <p>
        Не нарушайте правила сообщества, иначе вы будете заблокированы навсегда!
      </p>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => signOut(auth)}>
        Выйти из аккаунта
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'
          }
          alt="avatar"
        />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
