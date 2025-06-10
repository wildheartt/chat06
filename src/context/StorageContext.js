import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { FirebaseStorageService } from '../services/FirebaseStorageService';
import { LocalStorageService } from '../services/LocalStorageService';

const firebaseConfig = {
  apiKey: 'AIzaSyDYPTm3wcEtMRoydTMy-XgNx5KojVoPgbw',
  authDomain: 'chat-cc6fc.firebaseapp.com',
  projectId: 'chat-cc6fc',
  storageBucket: 'chat-cc6fc.firebasestorage.app',
  messagingSenderId: '224147244391',
  appId: '1:224147244391:web:525b1f6c4f2ad9ab889bc2',
};

export const STORAGE_TYPES = {
  FIREBASE: 'firebase',
  LOCALSTORAGE: 'localStorage',
};

const StorageContext = createContext();

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage должен использоваться внутри StorageProvider');
  }
  return context;
};

export const StorageProvider = ({ children }) => {
  const [storageType, setStorageType] = useState(
    localStorage.getItem('storage-type') || STORAGE_TYPES.FIREBASE
  );
  const [storageService, setStorageService] = useState(null);

  useEffect(() => {
    let service;

    if (storageType === STORAGE_TYPES.FIREBASE) {
      const app = initializeApp(firebaseConfig);
      service = new FirebaseStorageService(app);
    } else {
      service = new LocalStorageService();
    }

    setStorageService(service);
    localStorage.setItem('storage-type', storageType);
  }, [storageType]);

  const switchStorageType = (newType) => {
    if (Object.values(STORAGE_TYPES).includes(newType)) {
      setStorageType(newType);
    }
  };

  const value = {
    storageService,
    storageType,
    switchStorageType,
    availableTypes: STORAGE_TYPES,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};
