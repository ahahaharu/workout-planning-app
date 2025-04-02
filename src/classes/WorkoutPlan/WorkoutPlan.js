import { StrengthExercise } from "../Exercise/StrengthExercise.js";

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
  }

  removeExercise(exerciseId) {
    this.exercises.filter((exercise) => exercise.id !== exerciseId);
  }

  addNote(note) {
    this.notes.push(note);
  }

  removeNote(noteIndex) {
    this.notes.splice(noteIndex, 1);
  }

  
}
