export class StorageService {
    constructor(storageKey) {
      this.storageKey = storageKey;
    }
  
    getData() {
      if (typeof window === 'undefined') return null;
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    }
  
    saveData(data) {
      if (typeof window === 'undefined') return;
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  
    clearData() {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(this.storageKey);
    }
  }