import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";
import { WorkoutPlan } from "../WorkoutPlan/WorkoutPlan.js";
import { ExerciseStrategyFactory } from "../Exercise/Strategies/ExerciseStrategyFactory.js";

export class WorkoutPlanService {
  constructor(exerciseService, storageManager) {
    this.exerciseService = exerciseService;
    this.storageManager = storageManager;
    this.workoutPlans = this.storageManager.getWorkoutPlans() || [];
    this.strategyFactory = new ExerciseStrategyFactory();

    this._deserializeWorkoutPlans();
  }

  _deserializeWorkoutPlans() {
    this.workoutPlans = this.workoutPlans.map((planData) => {
      const workoutPlan = new WorkoutPlan(
        planData.id,
        planData.ownerId,
        planData.name,
        planData.description
      );

      if (planData.notes && planData.notes.length) {
        planData.notes.forEach((note) => {
          workoutPlan.addNote(note);
        });
      }

      if (planData.exercises && planData.exercises.length) {
        planData.exercises.forEach((exerciseData) => {
          const originalExercise = this.exerciseService.getExerciseById(
            exerciseData.id
          );
          if (originalExercise) {
            const planExercise = workoutPlan.addExercise(originalExercise);

            if (
              exerciseData.type === ExerciseType.STRENGTH &&
              exerciseData.sets
            ) {
              exerciseData.sets.forEach((set) => {
                workoutPlan.addSetToExercise(
                  exerciseData.id,
                  set.reps,
                  set.weight
                );
              });
            } else if (
              exerciseData.type === ExerciseType.CARDIO &&
              exerciseData.sessions
            ) {
              exerciseData.sessions.forEach((session) => {
                workoutPlan.addSessionToExercise(
                  exerciseData.id,
                  session.duration,
                  session.distance,
                  session.caloriesBurned
                );
              });
            } else if (
              exerciseData.type === ExerciseType.ENDURANCE &&
              exerciseData.sessions
            ) {
              exerciseData.sessions.forEach((session) => {
                workoutPlan.addEnduranceSessionToExercise(
                  exerciseData.id,
                  session.duration,
                  session.difficulty
                );
              });
            }
          }
        });
      }

      return workoutPlan;
    });
  }

  _saveWorkoutPlans() {
    this.storageManager.saveWorkoutPlans(this.workoutPlans);
  }

  generateWorkoutPlanId() {
    if (!this.workoutPlans.length) return 0;
    return Math.max(...this.workoutPlans.map((plan) => plan.id)) + 1;
  }

  createWorkoutPlan(ownerId, name, description) {
    const id = this.generateWorkoutPlanId();
    const workoutPlan = new WorkoutPlan(id, ownerId, name, description);

    this.workoutPlans.push(workoutPlan);
    this._saveWorkoutPlans();
    return workoutPlan;
  }

  deleteWorkoutPlan(workoutPlanId) {
    this.workoutPlans = this.workoutPlans.filter(
      (workoutPlan) => workoutPlan.id !== workoutPlanId
    );
    this._saveWorkoutPlans();
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
    this._saveWorkoutPlans();
    return workoutPlan;
  }

  removeExerciseFromWorkoutPlan(workoutPlanId, exerciseId) {
    const workoutPlan = this.getWorkoutPlanById(workoutPlanId);

    if (!workoutPlan) {
      throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
    }

    workoutPlan.removeExercise(exerciseId);
    this._saveWorkoutPlans();
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
      this._saveWorkoutPlans();
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
      this._saveWorkoutPlans();
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

    workoutPlan.removeTrackingData(exerciseId, index);
    this._saveWorkoutPlans();
    return workoutPlan;
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

  addCardioSessionToExerciseInWorkoutPlan(
    planId,
    exerciseId,
    duration,
    distance,
    caloriesBurned
  ) {
    const plan = this.getWorkoutPlanById(planId);
    if (!plan) throw new Error(`План ${planId} не найден`);

    const exerciseIndex = plan.exercises.findIndex(
      (ex) => ex.id === exerciseId
    );
    if (exerciseIndex === -1)
      throw new Error(`Упражнение ${exerciseId} не найдено в плане ${planId}`);

    if (!plan.exercises[exerciseIndex].sessions) {
      plan.exercises[exerciseIndex].sessions = [];
    }

    plan.exercises[exerciseIndex].sessions.push({
      duration,
      distance,
      caloriesBurned,
    });

    this._savePlans();
    return plan;
  }

  addEnduranceSessionToExerciseInWorkoutPlan(
    planId,
    exerciseId,
    duration,
    difficulty
  ) {
    const plan = this.getWorkoutPlanById(planId);
    if (!plan) throw new Error(`План ${planId} не найден`);

    const exerciseIndex = plan.exercises.findIndex(
      (ex) => ex.id === exerciseId
    );
    if (exerciseIndex === -1)
      throw new Error(`Упражнение ${exerciseId} не найдено в плане ${planId}`);

    if (!plan.exercises[exerciseIndex].sessions) {
      plan.exercises[exerciseIndex].sessions = [];
    }

    plan.exercises[exerciseIndex].sessions.push({
      duration,
      difficulty,
    });

    this._savePlans();
    return plan;
  }
}
