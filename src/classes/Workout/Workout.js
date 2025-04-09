import { StrengthExercise } from "../Exercise/StrengthExercise.js";

export class Workout {
  constructor(id, ownerId, date, plan = null) {
    this.id = id;
    this.ownerId = ownerId;
    this.date = date || new Date();
    this.plan = plan;

    // Создаем глубокую копию упражнений и их подходов
    this.exercises = plan
      ? plan.exercises.map((ex) => {
          // Создаем новое упражнение с пустыми подходами
          const newExercise = new StrengthExercise(
            ex.id,
            ex.name,
            ex.image,
            ex.description,
            ex.mediaUrl,
            ex.type,
            ex.bodyPart,
            [] // Пустой массив подходов
          );

          // Копируем каждый подход отдельно
          if (ex.sets && ex.sets.length) {
            ex.sets.forEach((set) => {
              newExercise.addSet(set.reps, set.weight);
            });
          }

          return newExercise;
        })
      : [];
  }

  addExercise(exercise) {
    if (!(exercise instanceof StrengthExercise)) {
      throw new Error("Exercise must be an instance of StrengthExercise");
    }

    // Создаем новое упражнение с пустыми подходами
    const newExercise = new StrengthExercise(
      exercise.id,
      exercise.name,
      exercise.image,
      exercise.description,
      exercise.mediaUrl,
      exercise.type,
      exercise.bodyPart,
      [] // Пустой массив подходов
    );

    // Копируем каждый подход отдельно
    if (exercise.sets && exercise.sets.length) {
      exercise.sets.forEach((set) => {
        newExercise.addSet(set.reps, set.weight);
      });
    }

    this.exercises.push(newExercise);
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

  hasChangesFromPlan() {
    if (!this.plan) return false;

    for (const exercise of this.exercises) {
      const planExercise = this.plan.exercises.find(
        (ex) => ex.id === exercise.id
      );

      if (!planExercise) return true;

      if (exercise.sets.length !== planExercise.sets.length) return true;

      for (let i = 0; i < exercise.sets.length; i++) {
        if (
          exercise.sets[i].reps !== planExercise.sets[i].reps ||
          exercise.sets[i].weight !== planExercise.sets[i].weight
        ) {
          return true;
        }
      }
    }

    if (this.plan.exercises.length > this.exercises.length) return true;

    return false;
  }

  updatePlanSets() {
    if (!this.plan) return false;

    for (const exercise of this.exercises) {
      const planExercise = this.plan.exercises.find(
        (ex) => ex.id === exercise.id
      );

      if (planExercise) {
        planExercise.sets = [];

        for (const set of exercise.sets) {
          planExercise.addSet(set.reps, set.weight);
        }
      }
    }

    return true;
  }
}
