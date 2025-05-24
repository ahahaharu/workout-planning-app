import { User } from "../User/User.js";

export class UserService {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.users = this.storageManager.getUsers() || [];
    this.currentUser = null;
    
    // Десериализация объектов User из localStorage
    this._deserializeUsers();
  }

  _deserializeUsers() {
    // Преобразуем простые объекты из localStorage в экземпляры класса User
    this.users = this.users.map(userData => {
      const user = new User(
        userData.id,
        userData.name,
        userData.password,
        userData.email,
        userData.currentWeight,
        userData.height
      );
      
      // Восстанавливаем историю веса
      if (userData.weightHistory && userData.weightHistory.length) {
        user.weightHistory = userData.weightHistory.map(entry => ({
          date: new Date(entry.date),
          weight: entry.weight
        }));
      }
      
      return user;
    });
  }

  _saveUsers() {
    this.storageManager.saveUsers(this.users);
  }

  getUserById(id) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new Error(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  generateUserId() {
    if (!this.users.length) return 1;
    return Math.max(...this.users.map(user => user.id)) + 1;
  }

  registerUser(name, password, email, currentWeight, height) {
    if (this.users.some((user) => user.email === email)) {
      throw new Error("Пользователь с таким email уже существует");
    }
    const id = this.generateUserId();
    const newUser = new User(id, name, password, email, currentWeight, height);
    this.users.push(newUser);
    this._saveUsers();
    return newUser;
  }

  loginUser(email, password) {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      throw new Error("Пользователя с таким email не существует");
    }

    if (user.password !== password) {
      throw new Error("Неверный пароль");
    }

    this.currentUser = user;
    return user;
  }

  updateUserWeight(newWeight) {
    this.validateCurrentUser();
    this.currentUser.updateWeight(newWeight);
    this._saveUsers();
  }

  updateUserProfile(name, password, email, height) {
    this.validateCurrentUser();
    this.currentUser.updateProfile(name, password, email, height);
    this._saveUsers();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  validateCurrentUser() {
    if (!this.currentUser) {
      throw new Error("Пользователь не авторизован");
    }
  }

  getAllUsers() {
    return this.users;
  }
}
