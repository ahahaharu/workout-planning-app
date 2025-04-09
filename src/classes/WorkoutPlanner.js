import { CardioExercise } from "./Exercise/CardioExercise.js";
import { ExerciseType } from "./Exercise/Constants/ExerciseType.js";
import { EnduranceExercise } from "./Exercise/EnduranceExercise.js";
import { ExerciseFactory } from "./Exercise/Factory/ExerciseFactory.js";
import { StrengthExercise } from "./Exercise/StrengthExercise.js";
import { Statistics } from "./Statistics/Statistics.js";
import { User } from "./User/User.js";
import { Workout } from "./Workout/Workout.js";
import { WorkoutPlan } from "./WorkoutPlan/WorkoutPlan.js";

export class WorkoutPlanner {
  constructor() {
    this.users = [];
    this.exercises = [];
    this.workoutPlans = [];
    this.workouts = [];
    this.currentUser = null;
    this.statistics = new Statistics();
  }

  showUsers() {
    console.log(this.users);
  }

  showExercises() {
    console.log(this.exercises);
  }

  showWorkoutPlans() {
    console.log(this.workoutPlans);
  }

  showWorkouts() {
    console.log(this.workouts);
  }

  generateUserId() {
    if (!this.users.length) return 1;
    return this.users.at(-1).id + 1;
  }

  userReg(name, password, email, currentWeight, height) {
    if (this.users.some((user) => user.email === email)) {
      throw new Error("Пользователь с таким email уже существует");
    }
    const id = this.generateUserId();

    const newUser = new User(id, name, password, email, currentWeight, height);

    this.users.push(newUser);
    console.log(`Пользователь ${newUser.name} зарегестрирован`);
  }

  userLogin(email, password) {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      throw new Error("Пользователя с таким email не существует");
    }

    if (user.password !== password) {
      throw new Error("Неверный пароль");
    }

    this.currentUser = user;
    this.statistics.setUser(user);
    console.log(`Пользователь ${user.name} вошёл в систему`);
  }

  updateWeight(newWeight) {
    this.currentUser.updateWeight(newWeight);
    console.log(`Пользователь обновил вес на ${newWeight} кг`);
  }

  updateProfile(name, password, email, height) {
    this.currentUser.updateProfile(name, password, email, height);
    console.log("Пользователь обновил профиль");
  }

  generateExerciseId() {
    if (!this.exercises.length) return 0;
    return this.exercises.at(-1).id + 1;
  }

  createStrengthExercise(name, image, description, mediaUrl, bodyPart, sets) {
    const id = this.generateExerciseId();
    const newExercise = ExerciseFactory.createStrengthExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      bodyPart,
      sets
    );

    this.exercises.push(newExercise);
    console.log(`Упражнение ${newExercise.name} добавлено`);
    return newExercise;
  }

  removeExercise(exerciseId) {
    this.exercises = this.exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );
  }

  // addSetToExercise(exerciseId, reps, weight) {
  //   const exercise = this.exercises.find(
  //     (exercise) => exercise.id === exerciseId
  //   );

  //   exercise.addSet(reps, weight);
  // }

  // removeSetFromExercise(exerciseId, setIndex) {
  //   const exercise = this.exercises.find(
  //     (exercise) => exercise.id === exerciseId
  //   );

  //   exercise.removeSet(setIndex);
  // }

  // getSets(exerciseId) {
  //   const exercise = this.exercises.find(
  //     (exercise) => exercise.id === exerciseId
  //   );

  //   return exercise.getSets();
  // }

  generateWorkoutPlanId() {
    if (!this.workoutPlans.length) return 0;
    return this.workoutPlans.at(-1).id + 1;
  }

  createWorkoutPlan(name, description) {
    const id = this.generateWorkoutPlanId();

    const workoutPlan = new WorkoutPlan(
      id,
      this.currentUser.id,
      name,
      description
    );

    this.workoutPlans.push(workoutPlan);
    this.currentUser.addWorkoutPlan(workoutPlan);
    console.log("Программа тренировок создана");
  }

  deleteWorkoutPlan(workoutPlanId) {
    this.workoutPlans = this.workoutPlans.filter(
      (workoutPlan) => workoutPlan.id !== workoutPlanId
    );
    this.currentUser.workoutPlans.filter(
      (workoutPlan) => workoutPlan.id !== workoutPlanId
    );
  }

  addExerciseToWorkoutPlan(workoutPlanId, exerciseId) {
    const workoutPlan = this.workoutPlans.find(
      (workoutPlan) => workoutPlan.id === workoutPlanId
    );

    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    workoutPlan.addExercise(exercise);

    console.log(
      `Упражнение ${exercise.name} добавлено в программу тренировок ${workoutPlan.name}`
    );
  }

  removeExerciseFromWorkoutPlan(workoutPlanId, exerciseId) {
    const workoutPlan = this.workoutPlans.find(
      (workoutPlan) => workoutPlan.id === workoutPlanId
    );

    workoutPlan.removeExercise(exerciseId);
  }

  addSetToExerciseInWorkoutPlan(workoutPlanId, exerciseId, reps, weight) {
    const workoutPlan = this.workoutPlans.find(
      (workoutPlan) => workoutPlan.id === workoutPlanId
    );

    const exercise = workoutPlan.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    exercise.addSet(reps, weight);
  }

  getWorkoutPlanExercises(workoutPlanId) {
    const workoutPlan = this.workoutPlans.find(
      (workoutPlan) => workoutPlan.id === workoutPlanId
    );

    console.log(workoutPlan.exercises);
  }

  generateWorkoutId() {
    if (!this.workouts.length) return 0;
    return this.workouts.at(-1).id + 1;
  }

  createWorkout(date = null, workoutPlanId) {
    const id = this.generateWorkoutId();
    const workoutPlan = this.workoutPlans.find(
      (workoutPlan) => workoutPlan.id === workoutPlanId
    );

    const workout = new Workout(id, this.currentUser.id, date, workoutPlan);

    this.workouts.push(workout);
    this.currentUser.addWorkout(workout);
    console.log("Тренировка создана");
  }

  addExerciseToWorkout(workoutId, exerciseId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    if (!workout) {
      throw new Error(`Workout with id ${workoutId} not found`);
    }

    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    if (!exercise) {
      throw new Error(`Exercise with id ${exerciseId} not found`);
    }

    workout.addExercise(exercise);
    console.log(`Exercise ${exercise.name} added to workout`);
  }

  recordSetInWorkout(workoutId, exerciseId, reps, weight) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    workout.recordSet(exerciseId, reps, weight);
    console.log(`Записан сет со значениями ${reps} повторений ${weight} кг`);
  }

  updateSetInWorkout(workoutId, exerciseId, setIndex, reps, weight) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    workout.updateSet(exerciseId, setIndex, reps, weight);
    console.log(`Сет обновлён со значениями ${reps} подходов ${weight} кг`);
  }

  getTotalWeightForWorkout(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    console.log("Общий вес за тренировку: " + workout.getTotalWeight());
  }

  showWorkout(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    console.log(workout);
  }

  hasChangesFromPlan(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    return workout.hasChangesFromPlan();
  }

  updatePlanSetsInWorkout(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    workout.updatePlanSets();
  }

  getUserWeightProgress(startDate = null, endDate = null) {
    const dateWeights = this.statistics.getUserWeightProgress(
      startDate,
      endDate
    );

    console.log(dateWeights);
  }

  getWorkoutProgress(startDate = null, endDate = null) {
    const workoutProgress = this.statistics.getWorkoutProgress(
      startDate,
      endDate
    );

    console.log(workoutProgress);
  }

  getExerciseProgress(exerciseId, startDate = null, endDate = null) {
    const exerciseProgress = this.statistics.getExerciseProgress(
      exerciseId,
      startDate,
      endDate
    );

    console.log(exerciseProgress);
  }

  createCardioExercise(name, image, description, mediaUrl, cardioType) {
    const id = this.generateExerciseId();
    const newExercise = ExerciseFactory.createCardioExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      cardioType
    );

    this.exercises.push(newExercise);
    console.log(`Кардио упражнение ${newExercise.name} добавлено`);
    return newExercise;
  }

  addSessionToExerciseInWorkoutPlan(
    workoutPlanId,
    exerciseId,
    duration,
    distance,
    caloriesBurned = null
  ) {
    const workoutPlan = this.workoutPlans.find(
      (workoutPlan) => workoutPlan.id === workoutPlanId
    );

    const exercise = workoutPlan.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.CARDIO
    );

    if (exercise) {
      exercise.addSession(duration, distance, caloriesBurned);
      console.log(`Кардио сессия добавлена в упражнение ${exercise.name}`);
    }
  }

  recordCardioSessionInWorkout(
    workoutId,
    exerciseId,
    duration,
    distance,
    caloriesBurned = null
  ) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    workout.recordCardioSession(exerciseId, duration, distance, caloriesBurned);
    console.log(`Записана кардио сессия: ${duration} минут, ${distance} км`);
  }

  updateCardioSessionInWorkout(
    workoutId,
    exerciseId,
    sessionIndex,
    duration,
    distance,
    caloriesBurned
  ) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    workout.updateCardioSession(
      exerciseId,
      sessionIndex,
      duration,
      distance,
      caloriesBurned
    );
    console.log(`Кардио сессия обновлена: ${duration} минут, ${distance} км`);
  }

  getTotalDistanceForWorkout(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    console.log(
      "Общая дистанция за тренировку: " + workout.getTotalDistance() + " км"
    );
  }

  getTotalDurationForWorkout(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    console.log(
      "Общая длительность кардио за тренировку: " +
        workout.getTotalDuration() +
        " минут"
    );
  }

  getCardioProgress(exerciseId, startDate = null, endDate = null) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.CARDIO
    );

    if (!exercise) {
      console.log("Кардио упражнение не найдено");
      return;
    }

    const cardioProgress = this.statistics.getExerciseProgress(
      exerciseId,
      startDate,
      endDate
    );

    console.log("Прогресс кардио упражнения:", cardioProgress);
  }

  createEnduranceExercise(name, image, description, mediaUrl, targetMuscle) {
    const id = this.generateExerciseId();
    const newExercise = ExerciseFactory.createEnduranceExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      targetMuscle
    );

    this.exercises.push(newExercise);
    console.log(`Упражнение на выносливость ${newExercise.name} добавлено`);
    return newExercise;
  }

  addEnduranceSessionToExerciseInWorkoutPlan(
    workoutPlanId,
    exerciseId,
    duration,
    difficulty = null
  ) {
    const workoutPlan = this.workoutPlans.find(
      (workoutPlan) => workoutPlan.id === workoutPlanId
    );

    const exercise = workoutPlan.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.ENDURANCE
    );

    if (exercise) {
      exercise.addSession(duration, difficulty);
      console.log(
        `Сессия выносливости добавлена в упражнение ${exercise.name}`
      );
    }
  }

  recordEnduranceSessionInWorkout(
    workoutId,
    exerciseId,
    duration,
    difficulty = null
  ) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    workout.recordEnduranceSession(exerciseId, duration, difficulty);
    console.log(
      `Записана сессия выносливости: ${duration} секунд, сложность: ${
        difficulty || "не указана"
      }`
    );
  }

  updateEnduranceSessionInWorkout(
    workoutId,
    exerciseId,
    sessionIndex,
    duration,
    difficulty
  ) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    workout.updateEnduranceSession(
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
  }

  getTotalEnduranceDurationForWorkout(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    console.log(
      "Общее время упражнений на выносливость за тренировку: " +
        workout.getTotalEnduranceDuration() +
        " секунд"
    );
  }

  getMaxEnduranceDurationForWorkout(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    console.log(
      "Максимальная продолжительность упражнения на выносливость: " +
        workout.getMaxEnduranceDuration() +
        " секунд"
    );
  }

  getEnduranceTotalIntensityForWorkout(workoutId) {
    const workout = this.workouts.find((workout) => workout.id === workoutId);

    console.log(
      "Общая интенсивность упражнений на выносливость: " +
        workout.getTotalEnduranceIntensity()
    );
  }

  getEnduranceProgress(exerciseId, startDate = null, endDate = null) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.ENDURANCE
    );

    if (!exercise) {
      console.log("Упражнение на выносливость не найдено");
      return;
    }

    const enduranceProgress = this.statistics.getExerciseProgress(
      exerciseId,
      startDate,
      endDate
    );

    console.log("Прогресс упражнения на выносливость:", enduranceProgress);
  }

  createGenericExercise(
    type,
    name,
    image,
    description,
    mediaUrl,
    specificParam
  ) {
    const id = this.generateExerciseId();
    const newExercise = ExerciseFactory.createExercise(
      type,
      id,
      name,
      image,
      description,
      mediaUrl,
      specificParam
    );

    this.exercises.push(newExercise);
    console.log(`${type} упражнение ${newExercise.name} добавлено`);
    return newExercise;
  }
}
