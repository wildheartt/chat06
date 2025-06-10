import React, { useRef, useState } from 'react';
import './app.css';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { StorageProvider } from './context/StorageContext';
import StorageSwitch from './components/StorageSwitch';
import { useMessages } from './hooks/useMessages';

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
const analytics = getAnalytics(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <StorageProvider>
      <div className="App">
        <header>
          <h1>⚛️🔥💬</h1>
          <div className="header-controls">
            {user && <StorageSwitch />}
            <SignOut />
          </div>
        </header>
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
      </div>
    </StorageProvider>
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
  const { messages, loading, sendMessage: sendMsg } = useMessages(25);
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    try {
      await sendMsg({
        text: formValue,
        uid,
        photoURL,
      });

      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  };

  return (
    <>
      <main>
        {loading && <div className="loading">Загрузка сообщений...</div>}
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Напишите что-нибудь приятное"
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
