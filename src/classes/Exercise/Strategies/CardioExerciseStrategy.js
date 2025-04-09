import { ExerciseStrategy } from "./ExerciseStrategy.js";
import { CardioExercise } from "../CardioExercise.js";

export class CardioExerciseStrategy extends ExerciseStrategy {
  copyExercise(exercise) {
    const newExercise = new CardioExercise(
      exercise.id,
      exercise.name,
      exercise.image,
      exercise.description,
      exercise.mediaUrl,
      exercise.type,
      exercise.cardioType
    );

    const sessions = exercise.getSessions
      ? exercise.getSessions()
      : Array.isArray(exercise.sessions)
      ? exercise.sessions
      : [];

    if (sessions && sessions.length) {
      sessions.forEach((session) => {
        if (session && typeof session === "object") {
          newExercise.addSession(
            session.duration,
            session.distance,
            session.caloriesBurned
          );
        }
      });
    }

    return newExercise;
  }

  addTrackingData(exercise, data) {
    if (!data.duration || !data.distance) {
      throw new Error("Duration and distance required for cardio exercise");
    }
    exercise.addSession(data.duration, data.distance, data.caloriesBurned);
  }

  updateTrackingData(exercise, index, data) {
    if (!exercise.sessions[index]) {
      throw new Error(`Session at index ${index} not found`);
    }
    exercise.updateSession(
      index,
      data.duration,
      data.distance,
      data.caloriesBurned
    );
  }

  getStatistics(exercise) {
    return {
      totalDistance: exercise.getTotalDistance(),
      totalDuration: exercise.getTotalDuration(),
      bestPace: exercise.getBestPace(),
      averagePace: exercise.getAveragePace(),
      bestSpeed: exercise.getBestSpeed(),
      averageSpeed: exercise.getAverageSpeed(),
      totalCalories: exercise.getTotalCalories(),
    };
  }

  calculateProgress(firstExercise, lastExercise) {
    return {
      totalDistanceProgress:
        lastExercise.getTotalDistance() - firstExercise.getTotalDistance(),
      totalDurationProgress:
        lastExercise.getTotalDuration() - firstExercise.getTotalDuration(),
      bestPaceProgress:
        lastExercise.getBestPace() - firstExercise.getBestPace(),
      bestSpeedProgress:
        lastExercise.getBestSpeed() - firstExercise.getBestSpeed(),
      totalCaloriesProgress:
        lastExercise.getTotalCalories() - firstExercise.getTotalCalories(),
    };
  }

  hasChanges(exercise, planExercise) {
    if (exercise.sessions.length !== planExercise.sessions.length) return true;

    for (let i = 0; i < exercise.sessions.length; i++) {
      if (
        exercise.sessions[i].duration !== planExercise.sessions[i].duration ||
        exercise.sessions[i].distance !== planExercise.sessions[i].distance ||
        exercise.sessions[i].caloriesBurned !==
          planExercise.sessions[i].caloriesBurned
      ) {
        return true;
      }
    }

    return false;
  }

  updatePlanData(source, target) {
    target.sessions = [];

    for (const session of source.sessions) {
      target.addSession(
        session.duration,
        session.distance,
        session.caloriesBurned
      );
    }
  }
}
