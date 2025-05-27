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
    const sessions = exercise.sessions || [];
    const totalDistance = sessions.reduce(
      (sum, session) => sum + (Number(session.distance) || 0),
      0
    );
    const totalDuration = sessions.reduce(
      (sum, session) => sum + (Number(session.duration) || 0),
      0
    );
    const totalCalories = sessions.reduce(
      (sum, session) => sum + (Number(session.caloriesBurned) || 0),
      0
    );

    let bestPace = 0;
    let averagePace = 0;
    let bestSpeed = 0;
    let averageSpeed = 0;

    if (sessions.length > 0 && totalDistance > 0) {
      const paces = sessions
        .filter((s) => (Number(s.distance) || 0) > 0)
        .map((s) => (Number(s.duration) || 0) / (Number(s.distance) || 1));

      bestPace = Math.min(...paces);
      averagePace = totalDuration / totalDistance;

      const speeds = sessions
        .filter((s) => (Number(s.duration) || 0) > 0)
        .map(
          (s) => ((Number(s.distance) || 0) / (Number(s.duration) || 1)) * 60
        );

      bestSpeed = Math.max(...speeds);
      averageSpeed = totalDistance / (totalDuration / 60);
    }

    return {
      totalDistance,
      distance: totalDistance,
      totalDuration,
      duration: totalDuration,
      bestPace,
      averagePace,
      bestSpeed,
      averageSpeed,
      totalCalories,
      caloriesBurned: totalCalories,
    };
  }

  calculateProgress(firstExercise, lastExercise) {
    const firstStats = this.getStatistics(firstExercise);
    const lastStats = this.getStatistics(lastExercise);

    return {
      distanceProgress: lastStats.totalDistance - firstStats.totalDistance,
      durationProgress: lastStats.totalDuration - firstStats.totalDuration,
      caloriesProgress: lastStats.totalCalories - firstStats.totalCalories,

      totalDistanceProgress: lastStats.totalDistance - firstStats.totalDistance,
      totalDurationProgress: lastStats.totalDuration - firstStats.totalDuration,
      bestPaceProgress: lastStats.bestPace - firstStats.bestPace,
      bestSpeedProgress: lastStats.bestSpeed - firstStats.bestSpeed,
      totalCaloriesProgress: lastStats.totalCalories - firstStats.totalCalories,
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
