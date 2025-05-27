import { ExerciseStrategy } from "./ExerciseStrategy.js";
import { EnduranceExercise } from "../EnduranceExercise.js";

export class EnduranceExerciseStrategy extends ExerciseStrategy {
  copyExercise(exercise) {
    const newExercise = new EnduranceExercise(
      exercise.id,
      exercise.name,
      exercise.image,
      exercise.description,
      exercise.mediaUrl,
      exercise.type,
      exercise.targetMuscle
    );

    const sessions = exercise.getSessions
      ? exercise.getSessions()
      : Array.isArray(exercise.sessions)
      ? exercise.sessions
      : [];

    if (sessions && sessions.length) {
      sessions.forEach((session) => {
        if (session && typeof session === "object") {
          newExercise.addSession(session.duration, session.difficulty);
        }
      });
    }

    return newExercise;
  }

  addTrackingData(exercise, data) {
    if (!data.duration) {
      throw new Error("Duration required for endurance exercise");
    }
    exercise.addSession(data.duration, data.difficulty);
  }

  updateTrackingData(exercise, index, data) {
    if (!exercise.sessions[index]) {
      throw new Error(`Session at index ${index} not found`);
    }
    exercise.updateSession(index, data.duration, data.difficulty);
  }

  getStatistics(exercise) {
    const sessions = exercise.sessions || [];
    const totalDuration = sessions.reduce(
      (sum, session) => sum + (Number(session.duration) || 0),
      0
    );
    const averageDifficulty =
      sessions.length > 0
        ? sessions.reduce(
            (sum, session) => sum + (Number(session.difficulty) || 0),
            0
          ) / sessions.length
        : 0;

    const maxDuration =
      sessions.length > 0
        ? Math.max(...sessions.map((session) => Number(session.duration) || 0))
        : 0;

    return {
      totalDuration,
      duration: totalDuration,
      maxDuration,
      averageDifficulty,
      totalIntensity: averageDifficulty,
      difficulty: averageDifficulty,
      sessionsCount: sessions.length,
    };
  }

  calculateProgress(firstExercise, lastExercise) {
    const firstStats = this.getStatistics(firstExercise);
    const lastStats = this.getStatistics(lastExercise);

    return {
      durationProgress: lastStats.totalDuration - firstStats.totalDuration,
      intensityProgress: lastStats.totalIntensity - firstStats.totalIntensity,
      totalDurationProgress: lastStats.totalDuration - firstStats.totalDuration,
      maxDurationProgress: lastStats.maxDuration - firstStats.maxDuration,
      averageDifficultyProgress:
        lastStats.averageDifficulty - firstStats.averageDifficulty,
      totalIntensityProgress:
        lastStats.totalIntensity - firstStats.totalIntensity,
    };
  }

  hasChanges(exercise, planExercise) {
    if (exercise.sessions.length !== planExercise.sessions.length) return true;

    for (let i = 0; i < exercise.sessions.length; i++) {
      if (
        exercise.sessions[i].duration !== planExercise.sessions[i].duration ||
        exercise.sessions[i].difficulty !== planExercise.sessions[i].difficulty
      ) {
        return true;
      }
    }

    return false;
  }

  updatePlanData(source, target) {
    target.sessions = [];

    for (const session of source.sessions) {
      target.addSession(session.duration, session.difficulty);
    }
  }
}
