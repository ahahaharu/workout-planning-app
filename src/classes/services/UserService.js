import { User } from "../User/User.js";

export class UserService {
  constructor() {
    this.users = [];
    this.currentUser = null;
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
    return this.users.at(-1).id + 1;
  }

  registerUser(name, password, email, currentWeight, height) {
    if (this.users.some((user) => user.email === email)) {
      throw new Error("Пользователь с таким email уже существует");
    }
    const id = this.generateUserId();
    const newUser = new User(id, name, password, email, currentWeight, height);
    this.users.push(newUser);
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
  }

  updateUserProfile(name, password, email, height) {
    this.validateCurrentUser();
    this.currentUser.updateProfile(name, password, email, height);
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
