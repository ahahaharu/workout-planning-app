import { StrengthExercise } from "../Exercise/StrengthExercise.js";
import { CardioExercise } from "../Exercise/CardioExercise.js";
import { EnduranceExercise } from "../Exercise/EnduranceExercise.js";
import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";

export class WorkoutPlan {
  constructor(id, ownerId, name, description, exercises) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.description = description || "";
    this.exercises = [];
    this.notes = [];
  }

  updateWorkoutPlan(name, description) {
    this.name = name || this.name;
    this.description = description || this.description;
  }

  addExercise(ex) {
    if (ex.type === ExerciseType.STRENGTH) {
      const exercise = new StrengthExercise(
        ex.id,
        ex.name,
        ex.image,
        ex.description,
        ex.mediaUrl,
        ex.type,
        ex.bodyPart
      );
      this.exercises.push(exercise);
    } else if (ex.type === ExerciseType.CARDIO) {
      const exercise = new CardioExercise(
        ex.id,
        ex.name,
        ex.image,
        ex.description,
        ex.mediaUrl,
        ex.type,
        ex.cardioType
      );
      this.exercises.push(exercise);
    } else if (ex.type === ExerciseType.ENDURANCE) {
      const exercise = new EnduranceExercise(
        ex.id,
        ex.name,
        ex.image,
        ex.description,
        ex.mediaUrl,
        ex.type,
        ex.targetMuscle
      );
      this.exercises.push(exercise);
    }
  }

  addSetToExercise(exerciseId, reps, weight) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.STRENGTH
    );

    if (exercise) {
      exercise.addSet(reps, weight);
    }
  }

  addSessionToExercise(exerciseId, duration, distance, caloriesBurned = null) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.CARDIO
    );

    if (exercise) {
      exercise.addSession(duration, distance, caloriesBurned);
    }
  }

  removeSetFromExercise(exerciseId, setIndex) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.STRENGTH
    );

    if (exercise) {
      exercise.removeSet(setIndex);
    }
  }

  removeSessionFromExercise(exerciseId, sessionIndex) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.CARDIO
    );

    if (exercise) {
      exercise.removeSession(sessionIndex);
    }
  }

  updateSetInExercise(exerciseId, setIndex, reps, weight) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.STRENGTH
    );

    if (exercise) {
      exercise.updateSet(setIndex, reps, weight);
    }
  }

  updateSessionInExercise(
    exerciseId,
    sessionIndex,
    duration,
    distance,
    caloriesBurned
  ) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.CARDIO
    );

    if (exercise) {
      exercise.updateSession(sessionIndex, duration, distance, caloriesBurned);
    }
  }

  getSets(exerciseId) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.STRENGTH
    );

    return exercise ? exercise.getSets() : [];
  }

  getSessions(exerciseId) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.CARDIO
    );

    return exercise ? exercise.getSessions() : [];
  }

  removeExercise(exerciseId) {
    this.exercises = this.exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );
  }

  addNote(note) {
    this.notes.push(note);
  }

  removeNote(noteIndex) {
    this.notes.splice(noteIndex, 1);
  }

  addEnduranceSessionToExercise(exerciseId, duration, difficulty = null) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.ENDURANCE
    );

    if (exercise) {
      exercise.addSession(duration, difficulty);
    }
  }

  removeEnduranceSessionFromExercise(exerciseId, sessionIndex) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.ENDURANCE
    );

    if (exercise) {
      exercise.removeSession(sessionIndex);
    }
  }

  updateEnduranceSessionInExercise(
    exerciseId,
    sessionIndex,
    duration,
    difficulty
  ) {
    const exercise = this.exercises.find(
      (exercise) =>
        exercise.id === exerciseId && exercise.type === ExerciseType.ENDURANCE
    );

    if (exercise) {
      exercise.updateSession(sessionIndex, duration, difficulty);
    }
  }
}
