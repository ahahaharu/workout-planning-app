import { StorageService } from './StorageService.js';

export class LocalStorageManager {
  constructor() {
    this.userStorage = new StorageService('workout-app-users');
    this.exerciseStorage = new StorageService('workout-app-exercises');
    this.workoutPlanStorage = new StorageService('workout-app-workout-plans');
    this.workoutStorage = new StorageService('workout-app-workouts');
    
    // Инициализация хранилища при первом использовании
    this._initializeStorage();
  }

  _initializeStorage() {
    // Проверка, запущено ли в браузере
    if (typeof window === 'undefined') return;
    
    if (!this.userStorage.getData()) {
      this.userStorage.saveData([]);
    }
    
    if (!this.exerciseStorage.getData()) {
      this.exerciseStorage.saveData([]);
    }
    
    if (!this.workoutPlanStorage.getData()) {
      this.workoutPlanStorage.saveData([]);
    }
    
    if (!this.workoutStorage.getData()) {
      this.workoutStorage.saveData([]);
    }
  }

  // Методы для работы с пользователями
  getUsers() {
    return this.userStorage.getData() || [];
  }

  saveUsers(users) {
    this.userStorage.saveData(users);
  }

  // Методы для работы с упражнениями
  getExercises() {
    return this.exerciseStorage.getData() || [];
  }

  saveExercises(exercises) {
    this.exerciseStorage.saveData(exercises);
  }

  // Методы для работы с планами тренировок
  getWorkoutPlans() {
    return this.workoutPlanStorage.getData() || [];
  }

  saveWorkoutPlans(plans) {
    this.workoutPlanStorage.saveData(plans);
  }

  // Методы для работы с тренировками
  getWorkouts() {
    return this.workoutStorage.getData() || [];
  }

  saveWorkouts(workouts) {
    this.workoutStorage.saveData(workouts);
  }

  // Очистка данных
  clearAllData() {
    this.userStorage.clearData();
    this.exerciseStorage.clearData();
    this.workoutPlanStorage.clearData();
    this.workoutStorage.clearData();
    this._initializeStorage();
  }
}