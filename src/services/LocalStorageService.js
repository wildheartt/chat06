import { IStorageService } from './IStorageService';

export class LocalStorageService extends IStorageService {
  constructor() {
    super();
    this.storageKey = 'chat-messages';
    this.subscribers = new Set();
    this.currentMessages = this.getMessagesFromStorage();
  }

  async sendMessage(message) {
    const newMessage = {
      id: this.generateId(),
      text: message.text,
      createdAt: new Date().toISOString(),
      uid: message.uid,
      photoURL: message.photoURL,
    };

    this.currentMessages.push(newMessage);
    this.saveMessagesToStorage();
    this.notifySubscribers();
  }

  subscribeToMessages(messageLimit, callback) {
    const subscriber = {
      callback,
      limit: messageLimit,
    };

    this.subscribers.add(subscriber);

    const limitedMessages = this.getLimitedMessages(messageLimit);
    callback(limitedMessages);

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  getStorageType() {
    return 'LocalStorage';
  }

  getMessagesFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
      return [];
    }
  }

  saveMessagesToStorage() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.currentMessages)
      );
    } catch (error) {
      console.error('Ошибка при записи в localStorage:', error);
    }
  }

  getLimitedMessages(limit) {
    return this.currentMessages
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-limit);
  }

  notifySubscribers() {
    this.subscribers.forEach((subscriber) => {
      const limitedMessages = this.getLimitedMessages(subscriber.limit);
      subscriber.callback(limitedMessages);
    });
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
