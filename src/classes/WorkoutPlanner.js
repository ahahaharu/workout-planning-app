import { StrengthExercise } from "./Exercise/StrengthExercise.js";
import { User } from "./User/User.js";
import { WorkoutPlan } from "./WorkoutPlan/WorkoutPlan.js";

export class WorkoutPlannerApp {
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

  addSetToExercise(exerciseId, reps, weight) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    exercise.addSet(reps, weight);
  }

  removeSetFromExercise(exerciseId, setIndex) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    exercise.removeSet(setIndex);
  }

  getSets(exerciseId) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    return exercise.getSets();
  }

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
    console.log("Программа тренировок создана");
  }

  deleteWorkoutPlan(workoutPlanId) {
    this.workoutPlans.filter((workoutPlan) => workoutPlan.id !== workoutPlanId);
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
}
