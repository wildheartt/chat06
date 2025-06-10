import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { IStorageService } from './IStorageService';

export class FirebaseStorageService extends IStorageService {
  constructor(app) {
    super();
    this.firestore = getFirestore(app);
    this.messagesRef = collection(this.firestore, 'messages');
  }

  async sendMessage(message) {
    await addDoc(this.messagesRef, {
      text: message.text,
      createdAt: serverTimestamp(),
      uid: message.uid,
      photoURL: message.photoURL,
    });
  }

  subscribeToMessages(messageLimit, callback) {
    const q = query(
      this.messagesRef,
      orderBy('createdAt'),
      limit(messageLimit)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    });
  }

  getStorageType() {
    return 'Firebase';
  }
}
