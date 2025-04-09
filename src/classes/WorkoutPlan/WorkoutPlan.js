import { StrengthExercise } from "../Exercise/StrengthExercise.js";
import { CardioExercise } from "../Exercise/CardioExercise.js";

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
    if (ex.type === "Strength") {
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
    } else if (ex.type === "Cardio") {
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
    }
  }

  addSetToExercise(exerciseId, reps, weight) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId && exercise.type === "Strength"
    );

    if (exercise) {
      exercise.addSet(reps, weight);
    }
  }

  addSessionToExercise(exerciseId, duration, distance, caloriesBurned = null) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId && exercise.type === "Cardio"
    );

    if (exercise) {
      exercise.addSession(duration, distance, caloriesBurned);
    }
  }

  removeSetFromExercise(exerciseId, setIndex) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId && exercise.type === "Strength"
    );

    if (exercise) {
      exercise.removeSet(setIndex);
    }
  }

  removeSessionFromExercise(exerciseId, sessionIndex) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId && exercise.type === "Cardio"
    );

    if (exercise) {
      exercise.removeSession(sessionIndex);
    }
  }

  updateSetInExercise(exerciseId, setIndex, reps, weight) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId && exercise.type === "Strength"
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
      (exercise) => exercise.id === exerciseId && exercise.type === "Cardio"
    );

    if (exercise) {
      exercise.updateSession(sessionIndex, duration, distance, caloriesBurned);
    }
  }

  getSets(exerciseId) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId && exercise.type === "Strength"
    );

    return exercise ? exercise.getSets() : [];
  }

  getSessions(exerciseId) {
    const exercise = this.exercises.find(
      (exercise) => exercise.id === exerciseId && exercise.type === "Cardio"
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
}
