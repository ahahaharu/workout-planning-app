import { Workout } from "../Workout/Workout.js";

export class WorkoutService {
  constructor(exerciseService, workoutPlanService) {
    this.workouts = [];
    this.exerciseService = exerciseService;
    this.workoutPlanService = workoutPlanService;
  }

  generateWorkoutId() {
    if (!this.workouts.length) return 0;
    return this.workouts.at(-1).id + 1;
  }

  createWorkout(ownerId, date = null, workoutPlanId = null) {
    const id = this.generateWorkoutId();
    let workoutPlan = null;

    if (workoutPlanId !== null) {
      workoutPlan = this.workoutPlanService.getWorkoutPlanById(workoutPlanId);

      if (!workoutPlan) {
        throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
      }
    }

    const workout = new Workout(id, ownerId, date, workoutPlan);
    this.workouts.push(workout);
    return workout;
  }

  addExerciseToWorkout(workoutId, exerciseId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    const exercise = this.exerciseService.getExerciseById(exerciseId);

    if (!exercise) {
      throw new Error(`Упражнение с ID ${exerciseId} не найдено`);
    }

    workout.addExercise(exercise);
    return workout;
  }

  recordSetInWorkout(workoutId, exerciseId, reps, weight) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.recordSet(exerciseId, reps, weight);
    return workout;
  }

  updateSetInWorkout(workoutId, exerciseId, setIndex, reps, weight) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.updateSet(exerciseId, setIndex, reps, weight);
    return workout;
  }

  recordCardioSessionInWorkout(
    workoutId,
    exerciseId,
    duration,
    distance,
    caloriesBurned = null
  ) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.recordCardioSession(exerciseId, duration, distance, caloriesBurned);
    return workout;
  }

  updateCardioSessionInWorkout(
    workoutId,
    exerciseId,
    sessionIndex,
    duration,
    distance,
    caloriesBurned
  ) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.updateCardioSession(
      exerciseId,
      sessionIndex,
      duration,
      distance,
      caloriesBurned
    );
    return workout;
  }

  recordEnduranceSessionInWorkout(
    workoutId,
    exerciseId,
    duration,
    difficulty = null
  ) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.recordEnduranceSession(exerciseId, duration, difficulty);
    return workout;
  }

  updateEnduranceSessionInWorkout(
    workoutId,
    exerciseId,
    sessionIndex,
    duration,
    difficulty
  ) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.updateEnduranceSession(
      exerciseId,
      sessionIndex,
      duration,
      difficulty
    );
    return workout;
  }

  getTotalWeightForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    return workout.getTotalWeight();
  }

  getTotalDistanceForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    return workout.getTotalDistance();
  }

  getTotalDurationForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    return workout.getTotalDuration();
  }

  getTotalEnduranceDurationForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    return workout.getTotalEnduranceDuration();
  }

  getMaxEnduranceDurationForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    return workout.getMaxEnduranceDuration();
  }

  getEnduranceTotalIntensityForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    return workout.getTotalEnduranceIntensity();
  }

  hasChangesFromPlan(workoutId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    return workout.hasChangesFromPlan();
  }

  updatePlanSetsInWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    return workout.updatePlanSets();
  }

  getWorkoutById(workoutId) {
    return this.workouts.find((workout) => workout.id === workoutId);
  }

  getWorkoutsForUser(userId) {
    return this.workouts.filter((workout) => workout.ownerId === userId);
  }

  getAllWorkouts() {
    return this.workouts;
  }
}
