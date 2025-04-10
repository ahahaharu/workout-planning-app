import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";
import { ExerciseStrategyFactory } from "../Exercise/Strategies/ExerciseStrategyFactory.js";

export class Workout {
  constructor(id, ownerId, date, plan = null) {
    this.id = id;
    this.ownerId = ownerId;
    this.date = date || new Date();
    this.plan = plan;
    this.exercises = [];

    this.strategyFactory = new ExerciseStrategyFactory();

    if (plan && plan.exercises) {
      this.exercises = plan.exercises
        .map((ex) => {
          try {
            const strategy = this.strategyFactory.getStrategy(ex.type);
            return strategy.copyExercise(ex);
          } catch (error) {
            console.error(`Error copying exercise: ${error.message}`);
            return null;
          }
        })
        .filter((ex) => ex !== null);
    }
  }

  addExercise(exercise) {
    try {
      const strategy = this.strategyFactory.getStrategy(exercise.type);
      const newExercise = strategy.copyExercise(exercise);
      this.exercises.push(newExercise);
      return newExercise;
    } catch (error) {
      throw new Error(`Failed to add exercise: ${error.message}`);
    }
  }

  getExerciseById(exerciseId) {
    return this.exercises.find((ex) => ex.id === exerciseId);
  }

  recordTrackingData(exerciseId, data) {
    const exercise = this.getExerciseById(exerciseId);
    if (!exercise) {
      throw new Error(`Exercise with id ${exerciseId} not found`);
    }

    const strategy = this.strategyFactory.getStrategy(exercise.type);
    strategy.addTrackingData(exercise, data);
  }

  recordSet(exerciseId, reps, weight) {
    return this.recordTrackingData(exerciseId, { reps, weight });
  }

  recordCardioSession(exerciseId, duration, distance, caloriesBurned = null) {
    return this.recordTrackingData(exerciseId, {
      duration,
      distance,
      caloriesBurned,
    });
  }

  recordEnduranceSession(exerciseId, duration, difficulty = null) {
    return this.recordTrackingData(exerciseId, { duration, difficulty });
  }

  updateTrackingData(exerciseId, index, data) {
    const exercise = this.getExerciseById(exerciseId);
    if (!exercise) {
      throw new Error(`Exercise with id ${exerciseId} not found`);
    }

    const strategy = this.strategyFactory.getStrategy(exercise.type);
    strategy.updateTrackingData(exercise, index, data);
  }

  updateSet(exerciseId, setIndex, reps, weight) {
    return this.updateTrackingData(exerciseId, setIndex, { reps, weight });
  }

  updateCardioSession(
    exerciseId,
    sessionIndex,
    duration,
    distance,
    caloriesBurned
  ) {
    return this.updateTrackingData(exerciseId, sessionIndex, {
      duration,
      distance,
      caloriesBurned,
    });
  }

  updateEnduranceSession(exerciseId, sessionIndex, duration, difficulty) {
    return this.updateTrackingData(exerciseId, sessionIndex, {
      duration,
      difficulty,
    });
  }

  getTotalStatisticByType(exerciseType, statName) {
    return this.exercises
      .filter((ex) => ex.type === exerciseType)
      .reduce((total, exercise) => {
        const strategy = this.strategyFactory.getStrategy(exercise.type);
        const stats = strategy.getStatistics(exercise);
        return total + (stats[statName] || 0);
      }, 0);
  }

  getTotalWeight() {
    return this.getTotalStatisticByType(ExerciseType.STRENGTH, "totalWeight");
  }

  getTotalDistance() {
    return this.getTotalStatisticByType(ExerciseType.CARDIO, "totalDistance");
  }

  getTotalDuration() {
    return this.getTotalStatisticByType(ExerciseType.CARDIO, "totalDuration");
  }

  getTotalCalories() {
    return this.getTotalStatisticByType(ExerciseType.CARDIO, "totalCalories");
  }

  getTotalEnduranceDuration() {
    return this.getTotalStatisticByType(
      ExerciseType.ENDURANCE,
      "totalDuration"
    );
  }

  getMaxEnduranceDuration() {
    const durations = this.exercises
      .filter((ex) => ex.type === ExerciseType.ENDURANCE)
      .map((exercise) => {
        const strategy = this.strategyFactory.getStrategy(exercise.type);
        const stats = strategy.getStatistics(exercise);
        return stats.maxDuration || 0;
      });

    return durations.length ? Math.max(...durations) : 0;
  }

  getTotalEnduranceIntensity() {
    return this.getTotalStatisticByType(
      ExerciseType.ENDURANCE,
      "totalIntensity"
    );
  }

  hasChangesFromPlan() {
    if (!this.plan) return false;

    if (this.plan.exercises.length > this.exercises.length) return true;

    for (const exercise of this.exercises) {
      const planExercise = this.plan.exercises.find(
        (ex) => ex.id === exercise.id
      );

      if (!planExercise) return true;

      const strategy = this.strategyFactory.getStrategy(exercise.type);
      if (strategy.hasChanges(exercise, planExercise)) {
        return true;
      }
    }

    return false;
  }

  updatePlanSets() {
    if (!this.plan) return false;

    for (const exercise of this.exercises) {
      const planExercise = this.plan.exercises.find(
        (ex) => ex.id === exercise.id
      );

      if (planExercise) {
        const strategy = this.strategyFactory.getStrategy(exercise.type);
        strategy.updatePlanData(exercise, planExercise);
      }
    }

    return true;
  }
}
