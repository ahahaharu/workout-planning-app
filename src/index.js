import { Set } from "./classes/Exercise/Set.js";
import { WorkoutPlanner } from "./classes/WorkoutPlanner.js";

const app = new WorkoutPlanner();

app.userReg("Андрей", "1111", "email@gmail.com", 70, "182");

app.userLogin("email@gmail.com", "1111");

app.showUsers();

app.updateWeight(72);

app.updateProfile("Иван");

app.createExercise("Жим блока ногами", null, "", null, "Strength", "Ноги");
app.createExercise("Жим лёжа", null, "", null, "Strength", "Грудь");

// console.log(app.getSets(0));

// app.addSetToExercise(0, 3, 12);

// console.log(app.getSets(0));

// app.removeSetFromExercise(0, 0);

// console.log(app.getSets(0));

app.createWorkoutPlan("Тренировка #1", "описание");

app.showWorkoutPlans();

app.addExerciseToWorkoutPlan(0, 0);

app.addSetToExerciseInWorkoutPlan(0, 0, 10, 100);
app.addSetToExerciseInWorkoutPlan(0, 0, 10, 100);
app.addSetToExerciseInWorkoutPlan(0, 0, 10, 100);

app.showWorkoutPlans();

app.getWorkoutPlanExercises(0);

app.createWorkout(null, 0);

app.addExerciseToWorkout(0, 1);

app.recordSetInWorkout(0, 1, 10, 50);
app.recordSetInWorkout(0, 1, 10, 50);
app.recordSetInWorkout(0, 1, 10, 50);

app.getTotalWeightForWorkout(0);

app.updateSetInWorkout(0, 0, 0, 10, 120);

app.showWorkout(0);

app.getTotalWeightForWorkout(0);

if (app.hasChangesFromPlan(0)) {
  app.updatePlanSetsInWorkout(0);
}

app.createWorkout(null, 0);

app.addExerciseToWorkout(1, 1);

app.recordSetInWorkout(1, 1, 10, 75);
app.recordSetInWorkout(1, 1, 10, 75);
app.recordSetInWorkout(1, 1, 10, 75);

app.getTotalWeightForWorkout(0);
app.getTotalWeightForWorkout(1);

app.getUserWeightProgress();

app.getWorkoutProgress();

app.getExerciseProgress(0);

app.getExerciseProgress(1);
