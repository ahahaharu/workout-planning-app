import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";
import { WorkoutPlan } from "../WorkoutPlan/WorkoutPlan.js";
import { ExerciseStrategyFactory } from "../Exercise/Strategies/ExerciseStrategyFactory.js";

export class WorkoutPlanService {
  constructor(exerciseService) {
    this.workoutPlans = [];
    this.exerciseService = exerciseService;
    this.strategyFactory = new ExerciseStrategyFactory();
  }

  generateWorkoutPlanId() {
    if (!this.workoutPlans.length) return 0;
    return this.workoutPlans.at(-1).id + 1;
  }

  createWorkoutPlan(ownerId, name, description) {
    const id = this.generateWorkoutPlanId();
    const workoutPlan = new WorkoutPlan(id, ownerId, name, description);

    this.workoutPlans.push(workoutPlan);
    return workoutPlan;
  }

  deleteWorkoutPlan(workoutPlanId) {
    this.workoutPlans = this.workoutPlans.filter(
      (workoutPlan) => workoutPlan.id !== workoutPlanId
    );
  }

  addExerciseToWorkoutPlan(workoutPlanId, exerciseId) {
    const workoutPlan = this.getWorkoutPlanById(workoutPlanId);
    const exercise = this.exerciseService.getExerciseById(exerciseId);

    if (!workoutPlan) {
      throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
    }

    if (!exercise) {
      throw new Error(`Упражнение с ID ${exerciseId} не найдено`);
    }

    workoutPlan.addExercise(exercise);
    return workoutPlan;
  }

  removeExerciseFromWorkoutPlan(workoutPlanId, exerciseId) {
    const workoutPlan = this.getWorkoutPlanById(workoutPlanId);

    if (!workoutPlan) {
      throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
    }

    workoutPlan.removeExercise(exerciseId);
    return workoutPlan;
  }

  addTrackingDataToExercise(workoutPlanId, exerciseId, data) {
    const workoutPlan = this.getWorkoutPlanById(workoutPlanId);

    if (!workoutPlan) {
      throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
    }

    const exercise = workoutPlan.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    if (!exercise) {
      throw new Error(`Упражнение с ID ${exerciseId} не найдено в плане`);
    }

    try {
      const strategy = this.strategyFactory.getStrategy(exercise.type);
      strategy.addTrackingData(exercise, data);
      return exercise;
    } catch (error) {
      throw new Error(`Ошибка добавления данных: ${error.message}`);
    }
  }

  addSetToExerciseInWorkoutPlan(workoutPlanId, exerciseId, reps, weight) {
    return this.addTrackingDataToExercise(workoutPlanId, exerciseId, {
      reps,
      weight,
    });
  }

  addSessionToExerciseInWorkoutPlan(
    workoutPlanId,
    exerciseId,
    duration,
    distance,
    caloriesBurned = null
  ) {
    return this.addTrackingDataToExercise(workoutPlanId, exerciseId, {
      duration,
      distance,
      caloriesBurned,
    });
  }

  addEnduranceSessionToExerciseInWorkoutPlan(
    workoutPlanId,
    exerciseId,
    duration,
    difficulty = null
  ) {
    return this.addTrackingDataToExercise(workoutPlanId, exerciseId, {
      duration,
      difficulty,
    });
  }

  updateTrackingDataInExercise(workoutPlanId, exerciseId, index, data) {
    const workoutPlan = this.getWorkoutPlanById(workoutPlanId);

    if (!workoutPlan) {
      throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
    }

    const exercise = workoutPlan.exercises.find(
      (exercise) => exercise.id === exerciseId
    );

    if (!exercise) {
      throw new Error(`Упражнение с ID ${exerciseId} не найдено в плане`);
    }

    try {
      const strategy = this.strategyFactory.getStrategy(exercise.type);
      strategy.updateTrackingData(exercise, index, data);
      return exercise;
    } catch (error) {
      throw new Error(`Ошибка обновления данных: ${error.message}`);
    }
  }

  updateSetInExercise(workoutPlanId, exerciseId, setIndex, reps, weight) {
    return this.updateTrackingDataInExercise(
      workoutPlanId,
      exerciseId,
      setIndex,
      { reps, weight }
    );
  }

  updateSessionInExercise(
    workoutPlanId,
    exerciseId,
    sessionIndex,
    duration,
    distance,
    caloriesBurned
  ) {
    return this.updateTrackingDataInExercise(
      workoutPlanId,
      exerciseId,
      sessionIndex,
      { duration, distance, caloriesBurned }
    );
  }

  updateEnduranceSessionInExercise(
    workoutPlanId,
    exerciseId,
    sessionIndex,
    duration,
    difficulty
  ) {
    return this.updateTrackingDataInExercise(
      workoutPlanId,
      exerciseId,
      sessionIndex,
      { duration, difficulty }
    );
  }

  removeTrackingDataFromExercise(workoutPlanId, exerciseId, index) {
    const workoutPlan = this.getWorkoutPlanById(workoutPlanId);

    if (!workoutPlan) {
      throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
    }

    return workoutPlan.removeTrackingData(exerciseId, index);
  }

  removeSetFromExercise(workoutPlanId, exerciseId, setIndex) {
    return this.removeTrackingDataFromExercise(
      workoutPlanId,
      exerciseId,
      setIndex
    );
  }

  removeSessionFromExercise(workoutPlanId, exerciseId, sessionIndex) {
    return this.removeTrackingDataFromExercise(
      workoutPlanId,
      exerciseId,
      sessionIndex
    );
  }

  getWorkoutPlanById(workoutPlanId) {
    return this.workoutPlans.find(
      (workoutPlan) => workoutPlan.id === workoutPlanId
    );
  }

  getWorkoutPlansForUser(userId) {
    return this.workoutPlans.filter((plan) => plan.ownerId === userId);
  }

  getAllWorkoutPlans() {
    return this.workoutPlans;
  }
}
