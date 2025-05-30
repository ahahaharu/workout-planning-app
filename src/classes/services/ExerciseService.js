import { ExerciseFactory } from "../Exercise/Factory/ExerciseFactory.js";
import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";
import { StrengthExercise } from "../Exercise/StrengthExercise.js";
import { CardioExercise } from "../Exercise/CardioExercise.js";
import { EnduranceExercise } from "../Exercise/EnduranceExercise.js";
import { Set } from "../Exercise/Set.js";
import { CardioSession } from "../Exercise/CardioSession.js";
import { EnduranceSession } from "../Exercise/EnduranceSession.js";

export class ExerciseService {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.exercises = this.storageManager.getExercises() || [];

    this._deserializeExercises();
  }

  _deserializeExercises() {
    this.exercises = this.exercises.map((exerciseData) => {
      let exercise;

      if (exerciseData.type === ExerciseType.STRENGTH) {
        exercise = new StrengthExercise(
          exerciseData.id,
          exerciseData.name,
          exerciseData.image,
          exerciseData.description,
          exerciseData.mediaUrl,
          exerciseData.type,
          exerciseData.bodyPart,
          []
        );

        if (exerciseData.sets && exerciseData.sets.length) {
          exerciseData.sets.forEach((set) => {
            exercise.addSet(set.reps, set.weight);
          });
        }
      } else if (exerciseData.type === ExerciseType.CARDIO) {
        exercise = new CardioExercise(
          exerciseData.id,
          exerciseData.name,
          exerciseData.image,
          exerciseData.description,
          exerciseData.mediaUrl,
          exerciseData.type,
          exerciseData.cardioType
        );

        if (exerciseData.sessions && exerciseData.sessions.length) {
          exerciseData.sessions.forEach((session) => {
            exercise.addSession(
              session.duration,
              session.distance,
              session.caloriesBurned
            );
          });
        }
      } else if (exerciseData.type === ExerciseType.ENDURANCE) {
        exercise = new EnduranceExercise(
          exerciseData.id,
          exerciseData.name,
          exerciseData.image,
          exerciseData.description,
          exerciseData.mediaUrl,
          exerciseData.type,
          exerciseData.targetMuscle
        );

        if (exerciseData.sessions && exerciseData.sessions.length) {
          exerciseData.sessions.forEach((session) => {
            exercise.addSession(session.duration, session.difficulty);
          });
        }
      }

      if (exerciseData.notes && exerciseData.notes.length) {
        exerciseData.notes.forEach((note) => {
          exercise.addNote(note);
        });
      }

      return exercise;
    });
  }

  _saveExercises() {
    this.storageManager.saveExercises(this.exercises);
  }

  generateExerciseId() {
    if (!this.exercises.length) return 0;
    return Math.max(...this.exercises.map((exercise) => exercise.id)) + 1;
  }

  createStrengthExercise(name, image, description, mediaUrl, bodyPart) {
    const id = this.generateExerciseId();
    const newExercise = ExerciseFactory.createStrengthExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      bodyPart
    );

    this.exercises.push(newExercise);
    this._saveExercises();
    return newExercise;
  }

  createCardioExercise(name, image, description, mediaUrl, cardioType) {
    const id = this.generateExerciseId();
    const newExercise = ExerciseFactory.createCardioExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      cardioType
    );

    this.exercises.push(newExercise);
    this._saveExercises();
    return newExercise;
  }

  createEnduranceExercise(name, image, description, mediaUrl, targetMuscle) {
    const id = this.generateExerciseId();
    const newExercise = ExerciseFactory.createEnduranceExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      targetMuscle
    );

    this.exercises.push(newExercise);
    this._saveExercises();
    return newExercise;
  }

  createGenericExercise(
    type,
    name,
    image,
    description,
    mediaUrl,
    specificParam
  ) {
    const id = this.generateExerciseId();
    const newExercise = ExerciseFactory.createExercise(
      type,
      id,
      name,
      image,
      description,
      mediaUrl,
      specificParam
    );

    this.exercises.push(newExercise);
    this._saveExercises();
    return newExercise;
  }

  removeExercise(exerciseId) {
    this.exercises = this.exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );
    this._saveExercises();
  }

  clearExerciseSets(workoutId, exerciseId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) return;

    const exercise = workout.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    if (exercise.sets) exercise.sets = [];
    if (exercise.completedSets) exercise.completedSets = [];

    this._saveWorkouts();
  }

  clearExerciseCardioSessions(workoutId, exerciseId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) return;

    const exercise = workout.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    if (exercise.sessions) exercise.sessions = [];
    if (exercise.completedSessions) exercise.completedSessions = [];

    this._saveWorkouts();
  }

  clearExerciseEnduranceSessions(workoutId, exerciseId) {
    this.clearExerciseCardioSessions(workoutId, exerciseId);
  }

  getExerciseById(exerciseId) {
    return this.exercises.find((exercise) => exercise.id === exerciseId);
  }

  getAllExercises() {
    return this.exercises;
  }
}
