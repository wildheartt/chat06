import React from 'react';
import { useStorage } from '../context/StorageContext';

const StorageSwitch = () => {
  const { storageType, switchStorageType, availableTypes, storageService } =
    useStorage();

  const handleStorageChange = (event) => {
    switchStorageType(event.target.value);
  };

  return (
    <div className="storage-switch">
      <label htmlFor="storage-select">Хранилище: </label>
      <select
        id="storage-select"
        value={storageType}
        onChange={handleStorageChange}
        className="storage-select"
      >
        <option value={availableTypes.FIREBASE}>Firebase</option>
        <option value={availableTypes.LOCALSTORAGE}>LocalStorage</option>
      </select>
      {storageService && (
        <span className="storage-indicator">
          ({storageService.getStorageType()})
        </span>
      )}
    </div>
  );
};

export default StorageSwitch;
