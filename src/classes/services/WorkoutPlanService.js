import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";
import { WorkoutPlan } from "../WorkoutPlan/WorkoutPlan.js";

export class WorkoutPlanService {
  constructor(exerciseService) {
    this.workoutPlans = [];
    this.exerciseService = exerciseService;
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

  addSetToExerciseInWorkoutPlan(workoutPlanId, exerciseId, reps, weight) {
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

    exercise.addSet(reps, weight);
    return exercise;
  }

  addSessionToExerciseInWorkoutPlan(
    workoutPlanId,
    exerciseId,
    duration,
    distance,
    caloriesBurned = null
  ) {
    const workoutPlan = this.getWorkoutPlanById(workoutPlanId);

    if (!workoutPlan) {
      throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
    }

    const exercise = workoutPlan.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.CARDIO
    );

    if (!exercise) {
      throw new Error(
        `Кардио упражнение с ID ${exerciseId} не найдено в плане`
      );
    }

    exercise.addSession(duration, distance, caloriesBurned);
    return exercise;
  }

  addEnduranceSessionToExerciseInWorkoutPlan(
    workoutPlanId,
    exerciseId,
    duration,
    difficulty = null
  ) {
    const workoutPlan = this.getWorkoutPlanById(workoutPlanId);

    if (!workoutPlan) {
      throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
    }

    const exercise = workoutPlan.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.ENDURANCE
    );

    if (!exercise) {
      throw new Error(
        `Упражнение на выносливость с ID ${exerciseId} не найдено в плане`
      );
    }

    exercise.addSession(duration, difficulty);
    return exercise;
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
