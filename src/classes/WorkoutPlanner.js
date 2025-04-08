import { StrengthExercise } from "./Exercise/StrengthExercise.js";
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

  createExercise(name, image, description, mediaUrl, type, bodyPart, sets) {
    const id = this.generateExerciseId();

    const newExercise = new StrengthExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      type,
      bodyPart,
      sets
    );

    this.exercises.push(newExercise);
    console.log(`Упражнение ${newExercise.name} добавлено`);
  }

  removeExercise(exerciseId) {
    this.exercises.filter((exercise) => exercise.id !== exerciseId);
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
    this.workoutPlans.filter((workoutPlan) => workoutPlan.id !== workoutPlanId);
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
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    workout.addExercise(exercise);
    console.log(`Упражнение ${exercise.name} добавлено в тренировку`);
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

  // addSetToExerciseInWorkout(workoutId, exerciseId, reps, weight) {
  //   const workout = this.workouts.find((workout) => workout.id === workoutId);

  //   const exercise = workout.exercises.find(
  //     (exercise) => exercise.id == exerciseId
  //   );

  //   exercise.addSet;
  // }
}
