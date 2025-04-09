import { StrengthExercise } from "../Exercise/StrengthExercise.js";
import { CardioExercise } from "../Exercise/CardioExercise.js";
import { EnduranceExercise } from "../Exercise/EnduranceExercise.js";
import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";
import { ExerciseStrategyFactory } from "../Exercise/Strategies/ExerciseStrategyFactory.js";

export class WorkoutPlan {
  constructor(id, ownerId, name, description, exercises) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.description = description || "";
    this.exercises = [];
    this.notes = [];

    // Создаем фабрику стратегий
    this.strategyFactory = new ExerciseStrategyFactory();
  }

  updateWorkoutPlan(name, description) {
    this.name = name || this.name;
    this.description = description || this.description;
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

  addTrackingData(exerciseId, data) {
    const exercise = this.getExerciseById(exerciseId);
    if (!exercise) {
      throw new Error(`Exercise with id ${exerciseId} not found`);
    }

    const strategy = this.strategyFactory.getStrategy(exercise.type);
    strategy.addTrackingData(exercise, data);
    return exercise;
  }

  // Методы-обёртки для обратной совместимости
  addSetToExercise(exerciseId, reps, weight) {
    return this.addTrackingData(exerciseId, { reps, weight });
  }

  addSessionToExercise(exerciseId, duration, distance, caloriesBurned = null) {
    return this.addTrackingData(exerciseId, {
      duration,
      distance,
      caloriesBurned,
    });
  }

  addEnduranceSessionToExercise(exerciseId, duration, difficulty = null) {
    return this.addTrackingData(exerciseId, { duration, difficulty });
  }

  updateTrackingData(exerciseId, index, data) {
    const exercise = this.getExerciseById(exerciseId);
    if (!exercise) {
      throw new Error(`Exercise with id ${exerciseId} not found`);
    }

    const strategy = this.strategyFactory.getStrategy(exercise.type);
    strategy.updateTrackingData(exercise, index, data);
  }

  // Методы-обёртки для обратной совместимости
  updateSetInExercise(exerciseId, setIndex, reps, weight) {
    return this.updateTrackingData(exerciseId, setIndex, { reps, weight });
  }

  updateSessionInExercise(
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

  updateEnduranceSessionInExercise(
    exerciseId,
    sessionIndex,
    duration,
    difficulty
  ) {
    return this.updateTrackingData(exerciseId, sessionIndex, {
      duration,
      difficulty,
    });
  }

  removeExercise(exerciseId) {
    this.exercises = this.exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );
  }

  removeTrackingData(exerciseId, index) {
    const exercise = this.getExerciseById(exerciseId);
    if (!exercise) {
      throw new Error(`Exercise with id ${exerciseId} not found`);
    }

    const strategy = this.strategyFactory.getStrategy(exercise.type);

    if (exercise.type === "Strength" && exercise.sets) {
      exercise.sets.splice(index, 1);
    } else if (
      (exercise.type === "Cardio" || exercise.type === "Endurance") &&
      exercise.sessions
    ) {
      exercise.sessions.splice(index, 1);
    }
  }

  // Методы-обёртки для обратной совместимости
  removeSetFromExercise(exerciseId, setIndex) {
    return this.removeTrackingData(exerciseId, setIndex);
  }

  removeSessionFromExercise(exerciseId, sessionIndex) {
    return this.removeTrackingData(exerciseId, sessionIndex);
  }

  removeEnduranceSessionFromExercise(exerciseId, sessionIndex) {
    return this.removeTrackingData(exerciseId, sessionIndex);
  }

  addNote(note) {
    this.notes.push(note);
  }

  removeNote(noteIndex) {
    this.notes.splice(noteIndex, 1);
  }
}
