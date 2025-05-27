import { StorageService } from "./StorageService.js";

export class LocalStorageManager {
  constructor() {
    this.userStorage = new StorageService("workout-app-users");
    this.exerciseStorage = new StorageService("workout-app-exercises");
    this.workoutPlanStorage = new StorageService("workout-app-workout-plans");
    this.workoutStorage = new StorageService("workout-app-workouts");

    // Инициализация хранилища при первом использовании
    this._initializeStorage();
  }

  _initializeStorage() {
    // Проверка, запущено ли в браузере
    if (typeof window === "undefined") return;

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

  syncLocalStorageWithLibrary(planner) {
    if (!planner || !planner.storageManager) {
      console.error("Планировщик или storageManager недоступны");
      return;
    }

    try {
      const users = JSON.parse(
        localStorage.getItem("workout-app-users") || "[]"
      );
      const exercises = JSON.parse(
        localStorage.getItem("workout-app-exercises") || "[]"
      );
      const workouts = JSON.parse(
        localStorage.getItem("workout-app-workouts") || "[]"
      );
      const workoutPlans = JSON.parse(
        localStorage.getItem("workout-app-workout-plans") || "[]"
      );

      console.log("Синхронизация данных из localStorage с библиотекой:");
      console.log(`- Пользователей: ${users.length}`);
      console.log(`- Упражнений: ${exercises.length}`);
      console.log(`- Тренировок: ${workouts.length}`);
      console.log(`- Планов тренировок: ${workoutPlans.length}`);

      planner.storageManager.saveUsers(users);
      planner.storageManager.saveExercises(exercises);
      planner.storageManager.saveWorkouts(workouts);
      planner.storageManager.saveWorkoutPlans(workoutPlans);

      planner.exerciseService._deserializeExercises();
      planner.workoutService._deserializeWorkouts();
      planner.workoutPlanService._deserializeWorkoutPlans();

      const exercisesAfter = planner.exerciseService.getAllExercises();
      const workoutsAfter = planner.workoutService.getAllWorkouts();

      console.log("После синхронизации:");
      console.log(`- Упражнений в сервисе: ${exercisesAfter.length}`);
      console.log(`- Тренировок в сервисе: ${workoutsAfter.length}`);

      return {
        success: true,
        counts: {
          users: users.length,
          exercises: exercises.length,
          workouts: workouts.length,
          workoutPlans: workoutPlans.length,
        },
      };
    } catch (error) {
      console.error("Ошибка при синхронизации данных:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getUsers() {
    return this.userStorage.getData() || [];
  }

  saveUsers(users) {
    this.userStorage.saveData(users);
  }

  getExercises() {
    return this.exerciseStorage.getData() || [];
  }

  saveExercises(exercises) {
    this.exerciseStorage.saveData(exercises);
  }

  getWorkoutPlans() {
    return this.workoutPlanStorage.getData() || [];
  }

  saveWorkoutPlans(plans) {
    this.workoutPlanStorage.saveData(plans);
  }

  getWorkouts() {
    return this.workoutStorage.getData() || [];
  }

  saveWorkouts(workouts) {
    this.workoutStorage.saveData(workouts);
  }

  clearAllData() {
    this.userStorage.clearData();
    this.exerciseStorage.clearData();
    this.workoutPlanStorage.clearData();
    this.workoutStorage.clearData();
    this._initializeStorage();
  }
}
