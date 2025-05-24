import { WorkoutPlanner } from "./classes/WorkoutPlanner.js";
import { User } from "./classes/User/User.js";
import { Exercise } from "./classes/Exercise/Exercise.js";
import { StrengthExercise } from "./classes/Exercise/StrengthExercise.js";
import { CardioExercise } from "./classes/Exercise/CardioExercise.js";
import { EnduranceExercise } from "./classes/Exercise/EnduranceExercise.js";
import { WorkoutPlan } from "./classes/WorkoutPlan/WorkoutPlan.js";
import { Workout } from "./classes/Workout/Workout.js";
import { ExerciseType } from "./classes/Exercise/Constants/ExerciseType.js";
import { ExerciseFactory } from "./classes/Exercise/Factory/ExerciseFactory.js";
import { LocalStorageManager } from "./classes/services/LocalStorageManager.js";
import { UserService } from "./classes/services/UserService.js";
import { ExerciseService } from "./classes/services/ExerciseService.js";
import { WorkoutPlanService } from "./classes/services/WorkoutPlanService.js";
import { WorkoutService } from "./classes/services/WorkoutService.js";
import { StatisticsService } from "./classes/services/StatisticsService.js";

// Экспортируем функцию для создания экземпляра WorkoutPlanner
export const createWorkoutPlanner = () => {
  return new WorkoutPlanner();
};

// Экспортируем основные классы и типы для использования в React-приложении
export {
  User,
  Exercise,
  StrengthExercise,
  CardioExercise, 
  EnduranceExercise,
  WorkoutPlan,
  Workout,
  ExerciseType,
  ExerciseFactory,
  LocalStorageManager,
  UserService,
  ExerciseService,
  WorkoutPlanService,
  WorkoutService,
  StatisticsService
};
