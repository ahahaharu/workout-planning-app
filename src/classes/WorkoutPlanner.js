import { UserService } from "./services/UserService.js";
import { ExerciseService } from "./services/ExerciseService.js";
import { WorkoutPlanService } from "./services/WorkoutPlanService.js";
import { WorkoutService } from "./services/WorkoutService.js";
import { StatisticsService } from "./services/StatisticsService.js";
import { LocalStorageManager } from "./services/LocalStorageManager.js";
import { ExerciseType } from "./Exercise/Constants/ExerciseType.js";

export class WorkoutPlanner {
  constructor() {
    // Инициализируем менеджер хранилища
    this.storageManager = new LocalStorageManager();
    
    // Инициализируем сервисы с использованием LocalStorageManager
    this.userService = new UserService(this.storageManager);
    this.exerciseService = new ExerciseService(this.storageManager);
    this.workoutPlanService = new WorkoutPlanService(this.exerciseService, this.storageManager);
    this.workoutService = new WorkoutService(
      this.exerciseService,
      this.workoutPlanService,
      this.storageManager
    );
    this.statisticsService = new StatisticsService(
      this.userService,
      this.workoutService
    );
  }

  // =========== Управление Пользователями ===========

  showUsers() {
    console.log(this.userService.getAllUsers());
  }

  userReg(name, password, email, currentWeight, height) {
    try {
      const newUser = this.userService.registerUser(
        name,
        password,
        email,
        currentWeight,
        height
      );
      console.log(`Пользователь ${newUser.name} зарегестрирован`);
      return newUser;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  userLogin(email, password) {
    try {
      const user = this.userService.loginUser(email, password);
      console.log(`Пользователь ${user.name} вошёл в систему`);
      return user;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  updateWeight(newWeight) {
    try {
      this.userService.updateUserWeight(newWeight);
      console.log(`Пользователь обновил вес на ${newWeight} кг`);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  updateProfile(name, password, email, height) {
    try {
      this.userService.updateUserProfile(name, password, email, height);
      console.log("Пользователь обновил профиль");
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // =========== Управление упражнениями ===========

  showExercises() {
    console.log(this.exerciseService.getAllExercises());
  }

  createStrengthExercise(name, image, description, mediaUrl, bodyPart, sets) {
    const newExercise = this.exerciseService.createStrengthExercise(
      name,
      image,
      description,
      mediaUrl,
      bodyPart,
      sets
    );
    console.log(`Упражнение ${newExercise.name} добавлено`);
    return newExercise;
  }

  createCardioExercise(name, image, description, mediaUrl, cardioType) {
    const newExercise = this.exerciseService.createCardioExercise(
      name,
      image,
      description,
      mediaUrl,
      cardioType
    );
    console.log(`Кардио упражнение ${newExercise.name} добавлено`);
    return newExercise;
  }

  createEnduranceExercise(name, image, description, mediaUrl, targetMuscle) {
    const newExercise = this.exerciseService.createEnduranceExercise(
      name,
      image,
      description,
      mediaUrl,
      targetMuscle
    );
    console.log(`Упражнение на выносливость ${newExercise.name} добавлено`);
    return newExercise;
  }

  createGenericExercise(
    type,
    name,
    image,
    description,
    mediaUrl,
    specificParam
  ) {
    const newExercise = this.exerciseService.createGenericExercise(
      type,
      name,
      image,
      description,
      mediaUrl,
      specificParam
    );
    console.log(`${type} упражнение ${newExercise.name} добавлено`);
    return newExercise;
  }

  removeExercise(exerciseId) {
    this.exerciseService.removeExercise(exerciseId);
  }

  // =========== Управление планами тренировок ===========

  showWorkoutPlans() {
    console.log(this.workoutPlanService.getAllWorkoutPlans());
  }

  createWorkoutPlan(name, description) {
    try {
      const userId = this.userService.getCurrentUser().id;
      const workoutPlan = this.workoutPlanService.createWorkoutPlan(
        userId,
        name,
        description
      );
      console.log("Программа тренировок создана");
      return workoutPlan;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  deleteWorkoutPlan(workoutPlanId) {
    try {
      this.workoutPlanService.deleteWorkoutPlan(workoutPlanId);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  addExerciseToWorkoutPlan(workoutPlanId, exerciseId) {
    try {
      const exercise = this.exerciseService.getExerciseById(exerciseId);
      const workoutPlan = this.workoutPlanService.addExerciseToWorkoutPlan(
        workoutPlanId,
        exerciseId
      );
      console.log(
        `Упражнение ${exercise.name} добавлено в программу тренировок ${workoutPlan.name}`
      );
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  removeExerciseFromWorkoutPlan(workoutPlanId, exerciseId) {
    try {
      return this.workoutPlanService.removeExerciseFromWorkoutPlan(
        workoutPlanId,
        exerciseId
      );
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  addSetToExerciseInWorkoutPlan(workoutPlanId, exerciseId, reps, weight) {
    try {
      this.workoutPlanService.addSetToExerciseInWorkoutPlan(
        workoutPlanId,
        exerciseId,
        reps,
        weight
      );
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  addSessionToExerciseInWorkoutPlan(
    workoutPlanId,
    exerciseId,
    duration,
    distance,
    caloriesBurned = null
  ) {
    try {
      const exercise =
        this.workoutPlanService.addSessionToExerciseInWorkoutPlan(
          workoutPlanId,
          exerciseId,
          duration,
          distance,
          caloriesBurned
        );
      console.log(`Кардио сессия добавлена в упражнение ${exercise.name}`);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  addEnduranceSessionToExerciseInWorkoutPlan(
    workoutPlanId,
    exerciseId,
    duration,
    difficulty = null
  ) {
    try {
      const exercise =
        this.workoutPlanService.addEnduranceSessionToExerciseInWorkoutPlan(
          workoutPlanId,
          exerciseId,
          duration,
          difficulty
        );
      console.log(
        `Сессия выносливости добавлена в упражнение ${exercise.name}`
      );
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getWorkoutPlanExercises(workoutPlanId) {
    try {
      const workoutPlan =
        this.workoutPlanService.getWorkoutPlanById(workoutPlanId);
      console.log(workoutPlan.exercises);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // =========== Управление тренировками ===========

  showWorkouts() {
    console.log(this.workoutService.getAllWorkouts());
  }

  createWorkout(date = null, workoutPlanId) {
    try {
      const userId = this.userService.getCurrentUser().id;
      const workout = this.workoutService.createWorkout(
        userId,
        date,
        workoutPlanId
      );
      console.log("Тренировка создана");
      return workout;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  addExerciseToWorkout(workoutId, exerciseId) {
    try {
      const workout = this.workoutService.addExerciseToWorkout(
        workoutId,
        exerciseId
      );
      const exercise = this.exerciseService.getExerciseById(exerciseId);
      console.log(`Exercise ${exercise.name} added to workout`);
      return workout;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  recordSetInWorkout(workoutId, exerciseId, reps, weight) {
    try {
      this.workoutService.recordSetInWorkout(
        workoutId,
        exerciseId,
        reps,
        weight
      );
      console.log(`Записан сет со значениями ${reps} повторений ${weight} кг`);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  updateSetInWorkout(workoutId, exerciseId, setIndex, reps, weight) {
    try {
      this.workoutService.updateSetInWorkout(
        workoutId,
        exerciseId,
        setIndex,
        reps,
        weight
      );
      console.log(`Сет обновлён со значениями ${reps} подходов ${weight} кг`);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  recordCardioSessionInWorkout(
    workoutId,
    exerciseId,
    duration,
    distance,
    caloriesBurned = null
  ) {
    try {
      this.workoutService.recordCardioSessionInWorkout(
        workoutId,
        exerciseId,
        duration,
        distance,
        caloriesBurned
      );
      console.log(`Записана кардио сессия: ${duration} минут, ${distance} км`);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  updateCardioSessionInWorkout(
    workoutId,
    exerciseId,
    sessionIndex,
    duration,
    distance,
    caloriesBurned
  ) {
    try {
      this.workoutService.updateCardioSessionInWorkout(
        workoutId,
        exerciseId,
        sessionIndex,
        duration,
        distance,
        caloriesBurned
      );
      console.log(`Кардио сессия обновлена: ${duration} минут, ${distance} км`);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  recordEnduranceSessionInWorkout(
    workoutId,
    exerciseId,
    duration,
    difficulty = null
  ) {
    try {
      this.workoutService.recordEnduranceSessionInWorkout(
        workoutId,
        exerciseId,
        duration,
        difficulty
      );
      console.log(
        `Записана сессия выносливости: ${duration} секунд, сложность: ${
          difficulty || "не указана"
        }`
      );
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  updateEnduranceSessionInWorkout(
    workoutId,
    exerciseId,
    sessionIndex,
    duration,
    difficulty
  ) {
    try {
      this.workoutService.updateEnduranceSessionInWorkout(
        workoutId,
        exerciseId,
        sessionIndex,
        duration,
        difficulty
      );
      console.log(
        `Сессия выносливости обновлена: ${duration} секунд, сложность: ${
          difficulty || "не указана"
        }`
      );
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  showWorkout(workoutId) {
    try {
      const workout = this.workoutService.getWorkoutById(workoutId);
      console.log(workout);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  hasChangesFromPlan(workoutId) {
    try {
      return this.workoutService.hasChangesFromPlan(workoutId);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  updatePlanSetsInWorkout(workoutId) {
    try {
      return this.workoutService.updatePlanSetsInWorkout(workoutId);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // =========== Управление показателями тренировки ===========

  getTotalWeightForWorkout(workoutId) {
    try {
      const totalWeight =
        this.workoutService.getTotalWeightForWorkout(workoutId);
      console.log("Общий вес за тренировку: " + totalWeight);
      return totalWeight;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getTotalDistanceForWorkout(workoutId) {
    try {
      const totalDistance =
        this.workoutService.getTotalDistanceForWorkout(workoutId);
      console.log("Общая дистанция за тренировку: " + totalDistance + " км");
      return totalDistance;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getTotalDurationForWorkout(workoutId) {
    try {
      const totalDuration =
        this.workoutService.getTotalDurationForWorkout(workoutId);
      console.log(
        "Общая длительность кардио за тренировку: " + totalDuration + " минут"
      );
      return totalDuration;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getTotalEnduranceDurationForWorkout(workoutId) {
    try {
      const totalDuration =
        this.workoutService.getTotalEnduranceDurationForWorkout(workoutId);
      console.log(
        "Общее время упражнений на выносливость за тренировку: " +
          totalDuration +
          " секунд"
      );
      return totalDuration;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getMaxEnduranceDurationForWorkout(workoutId) {
    try {
      const maxDuration =
        this.workoutService.getMaxEnduranceDurationForWorkout(workoutId);
      console.log(
        "Максимальная продолжительность упражнения на выносливость: " +
          maxDuration +
          " секунд"
      );
      return maxDuration;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getEnduranceTotalIntensityForWorkout(workoutId) {
    try {
      const totalIntensity =
        this.workoutService.getEnduranceTotalIntensityForWorkout(workoutId);
      console.log(
        "Общая интенсивность упражнений на выносливость: " + totalIntensity
      );
      return totalIntensity;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // =========== Управление статистикой ===========

  getUserWeightProgress(startDate = null, endDate = null) {
    try {
      const currentUser = this.userService.getCurrentUser();
      const dateWeights = this.statisticsService.getUserWeightProgress(
        currentUser.id,
        startDate,
        endDate
      );
      console.log(dateWeights);
      return dateWeights;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getWorkoutProgress(startDate = null, endDate = null) {
    try {
      const currentUser = this.userService.getCurrentUser();
      const workoutProgress = this.statisticsService.getWorkoutProgress(
        currentUser.id,
        startDate,
        endDate
      );
      console.log(workoutProgress);
      return workoutProgress;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getExerciseProgress(exerciseId, startDate = null, endDate = null) {
    try {
      const currentUser = this.userService.getCurrentUser();
      const exerciseProgress = this.statisticsService.getExerciseProgress(
        currentUser.id,
        exerciseId,
        startDate,
        endDate
      );
      console.log(exerciseProgress);
      return exerciseProgress;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getCardioProgress(exerciseId, startDate = null, endDate = null) {
    try {
      const exercise = this.exerciseService.getExerciseById(exerciseId);

      if (!exercise || exercise.type !== ExerciseType.CARDIO) {
        console.log("Кардио упражнение не найдено");
        return;
      }

      const currentUser = this.userService.getCurrentUser();
      const cardioProgress = this.statisticsService.getExerciseProgress(
        currentUser.id,
        exerciseId,
        startDate,
        endDate
      );

      console.log("Прогресс кардио упражнения:", cardioProgress);
      return cardioProgress;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  getEnduranceProgress(exerciseId, startDate = null, endDate = null) {
    try {
      const exercise = this.exerciseService.getExerciseById(exerciseId);

      if (!exercise || exercise.type !== ExerciseType.ENDURANCE) {
        console.log("Упражнение на выносливость не найдено");
        return;
      }

      const currentUser = this.userService.getCurrentUser();
      const enduranceProgress = this.statisticsService.getExerciseProgress(
        currentUser.id,
        exerciseId,
        startDate,
        endDate
      );

      console.log("Прогресс упражнения на выносливость:", enduranceProgress);
      return enduranceProgress;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
