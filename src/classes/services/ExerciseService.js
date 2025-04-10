import { ExerciseFactory } from "../Exercise/Factory/ExerciseFactory.js";

export class ExerciseService {
  constructor() {
    this.exercises = [];
  }

  generateExerciseId() {
    if (!this.exercises.length) return 0;
    return this.exercises.at(-1).id + 1;
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
    return newExercise;
  }

  removeExercise(exerciseId) {
    this.exercises = this.exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );
  }

  getExerciseById(exerciseId) {
    return this.exercises.find((exercise) => exercise.id === exerciseId);
  }

  getAllExercises() {
    return this.exercises;
  }
}
