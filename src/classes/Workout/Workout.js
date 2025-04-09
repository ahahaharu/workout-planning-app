import { StrengthExercise } from "../Exercise/StrengthExercise.js";
import { CardioExercise } from "../Exercise/CardioExercise.js";
import { EnduranceExercise } from "../Exercise/EnduranceExercise.js";

export class Workout {
  constructor(id, ownerId, date, plan = null) {
    this.id = id;
    this.ownerId = ownerId;
    this.date = date || new Date();
    this.plan = plan;

    // Создаем глубокую копию упражнений и их данных
    this.exercises = plan
      ? plan.exercises.map((ex) => {
          if (ex.type === "Strength") {
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
          } else if (ex.type === "Cardio") {
            // Создаем новое кардио упражнение с пустыми сессиями
            const newExercise = new CardioExercise(
              ex.id,
              ex.name,
              ex.image,
              ex.description,
              ex.mediaUrl,
              ex.type,
              ex.cardioType
            );

            // Копируем каждую сессию отдельно
            if (ex.sessions && ex.sessions.length) {
              ex.sessions.forEach((session) => {
                newExercise.addSession(
                  session.duration,
                  session.distance,
                  session.caloriesBurned
                );
              });
            }

            return newExercise;
          } else if (ex.type === "Endurance") {
            // Create a new endurance exercise with empty sessions
            const newExercise = new EnduranceExercise(
              ex.id,
              ex.name,
              ex.image,
              ex.description,
              ex.mediaUrl,
              ex.type,
              ex.targetMuscle
            );

            // Copy each session individually
            if (ex.sessions && ex.sessions.length) {
              ex.sessions.forEach((session) => {
                newExercise.addSession(session.duration, session.difficulty);
              });
            }

            return newExercise;
          }
        })
      : [];
  }

  addExercise(exercise) {
    if (exercise.type === "Strength" && exercise instanceof StrengthExercise) {
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
    } else if (
      exercise.type === "Cardio" &&
      exercise instanceof CardioExercise
    ) {
      // Создаем новое кардио упражнение с пустыми сессиями
      const newExercise = new CardioExercise(
        exercise.id,
        exercise.name,
        exercise.image,
        exercise.description,
        exercise.mediaUrl,
        exercise.type,
        exercise.cardioType
      );

      // Копируем каждую сессию отдельно
      if (exercise.sessions && exercise.sessions.length) {
        exercise.sessions.forEach((session) => {
          newExercise.addSession(
            session.duration,
            session.distance,
            session.caloriesBurned
          );
        });
      }

      this.exercises.push(newExercise);
    } else if (
      exercise.type === "Endurance" &&
      exercise instanceof EnduranceExercise
    ) {
      // Create a new endurance exercise with empty sessions
      const newExercise = new EnduranceExercise(
        exercise.id,
        exercise.name,
        exercise.image,
        exercise.description,
        exercise.mediaUrl,
        exercise.type,
        exercise.targetMuscle
      );

      // Copy each session individually
      if (exercise.sessions && exercise.sessions.length) {
        exercise.sessions.forEach((session) => {
          newExercise.addSession(session.duration, session.difficulty);
        });
      }

      this.exercises.push(newExercise);
    } else {
      throw new Error(
        "Exercise must be an instance of StrengthExercise or CardioExercise"
      );
    }
  }

  recordSet(exerciseId, reps, weight) {
    const exercise = this.exercises.find(
      (ex) => ex.id === exerciseId && ex.type === "Strength"
    );
    if (!exercise) {
      throw new Error(`Strength exercise with id ${exerciseId} not found`);
    }
    exercise.addSet(reps, weight);
  }

  recordCardioSession(exerciseId, duration, distance, caloriesBurned = null) {
    const exercise = this.exercises.find(
      (ex) => ex.id === exerciseId && ex.type === "Cardio"
    );
    if (!exercise) {
      throw new Error(`Cardio exercise with id ${exerciseId} not found`);
    }
    exercise.addSession(duration, distance, caloriesBurned);
  }

  updateSet(exerciseId, setIndex, reps, weight) {
    const exercise = this.exercises.find(
      (ex) => ex.id === exerciseId && ex.type === "Strength"
    );
    if (!exercise || !exercise.sets[setIndex]) {
      throw new Error(
        `Strength exercise with id ${exerciseId} or set at index ${setIndex} not found`
      );
    }
    exercise.updateSet(setIndex, reps, weight);
  }

  updateCardioSession(
    exerciseId,
    sessionIndex,
    duration,
    distance,
    caloriesBurned
  ) {
    const exercise = this.exercises.find(
      (ex) => ex.id === exerciseId && ex.type === "Cardio"
    );
    if (!exercise || !exercise.sessions[sessionIndex]) {
      throw new Error(
        `Cardio exercise with id ${exerciseId} or session at index ${sessionIndex} not found`
      );
    }
    exercise.updateSession(sessionIndex, duration, distance, caloriesBurned);
  }

  getTotalWeight() {
    return this.exercises
      .filter((ex) => ex.type === "Strength")
      .reduce((total, exercise) => {
        return total + exercise.getTotalWeight();
      }, 0);
  }

  getTotalDistance() {
    return this.exercises
      .filter((ex) => ex.type === "Cardio")
      .reduce((total, exercise) => {
        return total + exercise.getTotalDistance();
      }, 0);
  }

  getTotalDuration() {
    return this.exercises
      .filter((ex) => ex.type === "Cardio")
      .reduce((total, exercise) => {
        return total + exercise.getTotalDuration();
      }, 0);
  }

  getTotalCalories() {
    return this.exercises
      .filter((ex) => ex.type === "Cardio")
      .reduce((total, exercise) => {
        return total + exercise.getTotalCalories();
      }, 0);
  }

  recordEnduranceSession(exerciseId, duration, difficulty = null) {
    const exercise = this.exercises.find(
      (ex) => ex.id === exerciseId && ex.type === "Endurance"
    );
    if (!exercise) {
      throw new Error(`Endurance exercise with id ${exerciseId} not found`);
    }
    exercise.addSession(duration, difficulty);
  }

  updateEnduranceSession(exerciseId, sessionIndex, duration, difficulty) {
    const exercise = this.exercises.find(
      (ex) => ex.id === exerciseId && ex.type === "Endurance"
    );
    if (!exercise || !exercise.sessions[sessionIndex]) {
      throw new Error(
        `Endurance exercise with id ${exerciseId} or session at index ${sessionIndex} not found`
      );
    }
    exercise.updateSession(sessionIndex, duration, difficulty);
  }

  getTotalEnduranceDuration() {
    return this.exercises
      .filter((ex) => ex.type === "Endurance")
      .reduce((total, exercise) => {
        return total + exercise.getTotalDuration();
      }, 0);
  }

  getMaxEnduranceDuration() {
    const durations = this.exercises
      .filter((ex) => ex.type === "Endurance")
      .map((exercise) => exercise.getMaxDuration());

    return durations.length ? Math.max(...durations) : 0;
  }

  getTotalEnduranceIntensity() {
    return this.exercises
      .filter((ex) => ex.type === "Endurance")
      .reduce((total, exercise) => {
        return total + exercise.getTotalIntensity();
      }, 0);
  }

  hasChangesFromPlan() {
    if (!this.plan) return false;

    for (const exercise of this.exercises) {
      const planExercise = this.plan.exercises.find(
        (ex) => ex.id === exercise.id
      );

      if (!planExercise) return true;

      if (exercise.type === "Strength") {
        if (exercise.sets.length !== planExercise.sets.length) return true;

        for (let i = 0; i < exercise.sets.length; i++) {
          if (
            exercise.sets[i].reps !== planExercise.sets[i].reps ||
            exercise.sets[i].weight !== planExercise.sets[i].weight
          ) {
            return true;
          }
        }
      } else if (exercise.type === "Cardio") {
        if (exercise.sessions.length !== planExercise.sessions.length)
          return true;

        for (let i = 0; i < exercise.sessions.length; i++) {
          if (
            exercise.sessions[i].duration !==
              planExercise.sessions[i].duration ||
            exercise.sessions[i].distance !==
              planExercise.sessions[i].distance ||
            exercise.sessions[i].caloriesBurned !==
              planExercise.sessions[i].caloriesBurned
          ) {
            return true;
          }
        }
      } else if (exercise.type === "Endurance") {
        if (exercise.sessions.length !== planExercise.sessions.length)
          return true;

        for (let i = 0; i < exercise.sessions.length; i++) {
          if (
            exercise.sessions[i].duration !==
              planExercise.sessions[i].duration ||
            exercise.sessions[i].difficulty !==
              planExercise.sessions[i].difficulty
          ) {
            return true;
          }
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
        if (exercise.type === "Strength") {
          planExercise.sets = [];

          for (const set of exercise.sets) {
            planExercise.addSet(set.reps, set.weight);
          }
        } else if (exercise.type === "Cardio") {
          planExercise.sessions = [];

          for (const session of exercise.sessions) {
            planExercise.addSession(
              session.duration,
              session.distance,
              session.caloriesBurned
            );
          }
        } else if (exercise.type === "Endurance") {
          planExercise.sessions = [];

          for (const session of exercise.sessions) {
            planExercise.addSession(session.duration, session.difficulty);
          }
        }
      }
    }

    return true;
  }
}
