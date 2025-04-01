import { Set } from "./classes/Exercise/Set.js";
import { WorkoutPlannerApp } from "./classes/WorkoutPlannerApp.js";

const app = new WorkoutPlannerApp();

app.userReg("Андрей", "1111", "email@gmail.com", "70", "182");

app.userLogin("email@gmail.com", "1111");

app.showUsers();

app.updateWeight(72);

app.updateProfile("Иван");

app.createExercise("Жим блока ногами", null, "", null, "Strength", "Ноги", [
  new Set(3, 12),
  new Set(3, 12),
  new Set(3, 12),
]);

console.log(app.getSets(0));

app.addSetToExercise(0, 3, 12);

console.log(app.getSets(0));

app.removeSetFromExercise(0, 0);

console.log(app.getSets(0));

app.createWorkoutPlan("Тренировка #1", "описание");

app.showWorkoutPlans();

app.addExerciseToWorkoutPlan(0, 0);

app.showWorkoutPlans();
