import { Exercise } from "./Exercise.js";
import { EnduranceSession } from "./EnduranceSession.js";

export class EnduranceExercise extends Exercise {
  constructor(id, name, image, description, mediaUrl, type, targetMuscle) {
    super(id, name, image, description, mediaUrl, type);
    this.targetMuscle = targetMuscle; // "Core", "Arms", "Legs", etc.
    this.sessions = [];
  }

  addSession(duration, difficulty = null) {
    this.sessions.push(new EnduranceSession(duration, difficulty));
  }

  removeSession(sessionIndex) {
    this.sessions.splice(sessionIndex, 1);
  }

  getSessions() {
    return this.sessions;
  }

  updateSession(index, duration, difficulty) {
    this.sessions[index].duration = duration || this.sessions[index].duration;
    this.sessions[index].difficulty =
      difficulty || this.sessions[index].difficulty;
  }

  getTotalDuration() {
    return this.sessions.reduce(
      (acc, session) => acc + (session.duration || 0),
      0
    );
  }

  getAverageDuration() {
    if (this.sessions.length === 0) return 0;
    return this.getTotalDuration() / this.sessions.length;
  }

  getMaxDuration() {
    if (this.sessions.length === 0) return 0;
    return Math.max(...this.sessions.map((session) => session.duration));
  }

  getAverageDifficulty() {
    if (this.sessions.length === 0) return 0;
    return (
      this.sessions.reduce(
        (acc, session) => acc + (session.difficulty || 0),
        0
      ) / this.sessions.length
    );
  }

  getTotalIntensity() {
    return this.sessions.reduce(
      (acc, session) => acc + session.calculateIntensity(),
      0
    );
  }

  getAverageIntensity() {
    if (this.sessions.length === 0) return 0;
    return this.getTotalIntensity() / this.sessions.length;
  }
}
