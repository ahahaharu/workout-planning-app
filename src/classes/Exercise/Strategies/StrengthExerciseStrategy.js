import { ExerciseStrategy } from "./ExerciseStrategy.js";
import { StrengthExercise } from "../StrengthExercise.js";

export class StrengthExerciseStrategy extends ExerciseStrategy {
  copyExercise(exercise) {
    const newExercise = new StrengthExercise(
      exercise.id,
      exercise.name,
      exercise.image,
      exercise.description,
      exercise.mediaUrl,
      exercise.type,
      exercise.bodyPart,
      []
    );

    const sets = exercise.getSets
      ? exercise.getSets()
      : Array.isArray(exercise.sets)
      ? exercise.sets
      : [];

    if (sets && sets.length) {
      sets.forEach((set) => {
        if (
          set &&
          typeof set === "object" &&
          "reps" in set &&
          "weight" in set
        ) {
          newExercise.addSet(set.reps, set.weight);
        }
      });
    }

    return newExercise;
  }

  addTrackingData(exercise, data) {
    if (!data.reps || !data.weight) {
      throw new Error("Reps and weight required for strength exercise");
    }
    exercise.addSet(data.reps, data.weight);
  }

  updateTrackingData(exercise, index, data) {
    if (!exercise.sets[index]) {
      throw new Error(`Set at index ${index} not found`);
    }
    exercise.updateSet(index, data.reps, data.weight);
  }

  getStatistics(exercise) {
    return {
      totalWeight: exercise.getTotalWeight(),
      bestOneRepMax: exercise.getBestOneRepMax(),
      maxWeight: exercise.getMaxWeight(),
    };
  }

  calculateProgress(firstExercise, lastExercise) {
    return {
      bestOneReMaxProgress:
        lastExercise.getBestOneRepMax() - firstExercise.getBestOneRepMax(),
      maxWeightProgress:
        lastExercise.getMaxWeight() - firstExercise.getMaxWeight(),
      totalWeightProgress:
        lastExercise.getTotalWeight() - firstExercise.getTotalWeight(),
    };
  }

  hasChanges(exercise, planExercise) {
    if (exercise.sets.length !== planExercise.sets.length) return true;

    for (let i = 0; i < exercise.sets.length; i++) {
      if (
        exercise.sets[i].reps !== planExercise.sets[i].reps ||
        exercise.sets[i].weight !== planExercise.sets[i].weight
      ) {
        return true;
      }
    }

    return false;
  }

  updatePlanData(source, target) {
    target.sets = [];

    for (const set of source.sets) {
      target.addSet(set.reps, set.weight);
    }
  }
}
