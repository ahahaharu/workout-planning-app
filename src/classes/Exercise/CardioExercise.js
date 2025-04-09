import { Exercise } from "./Exercise.js";
import { CardioSession } from "./CardioSession.js";

export class CardioExercise extends Exercise {
  constructor(id, name, image, description, mediaUrl, type, cardioType) {
    super(id, name, image, description, mediaUrl, type);
    this.cardioType = cardioType;
    this.sessions = [];
  }

  addSession(duration, distance, caloriesBurned = null) {
    this.sessions.push(new CardioSession(duration, distance, caloriesBurned));
  }

  removeSession(sessionIndex) {
    this.sessions.splice(sessionIndex, 1);
  }

  getSessions() {
    return this.sessions;
  }

  updateSession(index, duration, distance, caloriesBurned) {
    this.sessions[index].duration = duration || this.sessions[index].duration;
    this.sessions[index].distance = distance || this.sessions[index].distance;
    this.sessions[index].caloriesBurned =
      caloriesBurned || this.sessions[index].caloriesBurned;
  }

  getTotalDuration() {
    return this.sessions.reduce(
      (acc, session) => acc + (session.duration || 0),
      0
    );
  }

  getTotalDistance() {
    return this.sessions.reduce(
      (acc, session) => acc + (session.distance || 0),
      0
    );
  }

  getTotalCalories() {
    return this.sessions.reduce(
      (acc, session) => acc + (session.caloriesBurned || 0),
      0
    );
  }

  getAveragePace() {
    if (this.sessions.length === 0) return 0;
    return (
      this.sessions.reduce((acc, session) => acc + session.calculatePace(), 0) /
      this.sessions.length
    );
  }

  getBestPace() {
    if (this.sessions.length === 0) return 0;
    return Math.min(
      ...this.sessions
        .map((session) => session.calculatePace())
        .filter((pace) => pace > 0)
    );
  }

  getAverageSpeed() {
    if (this.sessions.length === 0) return 0;
    return (
      this.sessions.reduce(
        (acc, session) => acc + session.calculateSpeed(),
        0
      ) / this.sessions.length
    );
  }

  getBestSpeed() {
    if (this.sessions.length === 0) return 0;
    return Math.max(
      ...this.sessions.map((session) => session.calculateSpeed())
    );
  }
}
