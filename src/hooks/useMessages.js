import { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';

export const useMessages = (limit = 25) => {
  const { storageService } = useStorage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storageService) {
      setLoading(true);
      return;
    }

    setLoading(true);

    const unsubscribe = storageService.subscribeToMessages(
      limit,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [storageService, limit]);

  const sendMessage = async (messageData) => {
    if (!storageService) {
      throw new Error('Сервис хранилища недоступен');
    }

    await storageService.sendMessage(messageData);
  };

  return {
    messages,
    loading,
    sendMessage,
  };
};
