import { StrengthExercise } from "../Exercise/StrengthExercise.js";

export class Workout {
  constructor(id, ownerId, date, plan = null) {
    this.id = id;
    this.ownerId = ownerId;
    this.date = date || new Date();
    this.plan = plan;
    this.exercises = plan
      ? plan.exercises.map(
          (ex) =>
            new StrengthExercise(
              ex.id,
              ex.name,
              ex.image,
              ex.description,
              ex.mediaUrl,
              ex.type,
              ex.bodyPart,
              ex.sets
            )
        )
      : [];
  }

  addExercise(exercise) {
    if (!(exercise instanceof StrengthExercise)) {
      throw new Error("Exercise must be an instance of StrengthExercise");
    }
    this.exercises.push(exercise);
  }

  recordSet(exerciseId, reps, weight) {
    const exercise = this.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) {
      throw new Error(`Exercise with id ${exerciseId} not found`);
    }
    exercise.addSet(reps, weight);
  }

  updateSet(exerciseId, setIndex, reps, weight) {
    const exercise = this.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise || !exercise.sets[setIndex]) {
      throw new Error(
        `Exercise with id ${exerciseId} or set at index ${setIndex} not found`
      );
    }
    exercise.updateSet(setIndex, reps, weight);
  }

  getTotalWeight() {
    return this.exercises.reduce((total, exercise) => {
      return total + exercise.getTotalWeight();
    }, 0);
  }
}
