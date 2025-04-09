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
    return {
      totalDuration: exercise.getTotalDuration(),
      maxDuration: exercise.getMaxDuration(),
      averageDifficulty: exercise.getAverageDifficulty(),
      totalIntensity: exercise.getTotalIntensity(),
      averageIntensity: exercise.getAverageIntensity(),
    };
  }

  calculateProgress(firstExercise, lastExercise) {
    return {
      totalDurationProgress:
        lastExercise.getTotalDuration() - firstExercise.getTotalDuration(),
      maxDurationProgress:
        lastExercise.getMaxDuration() - firstExercise.getMaxDuration(),
      averageDifficultyProgress:
        lastExercise.getAverageDifficulty() -
        firstExercise.getAverageDifficulty(),
      totalIntensityProgress:
        lastExercise.getTotalIntensity() - firstExercise.getTotalIntensity(),
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
