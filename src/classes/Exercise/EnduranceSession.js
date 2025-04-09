export class EnduranceSession {
  constructor(duration, difficulty = null) {
    this.duration = duration; // in seconds
    this.difficulty = difficulty; // subjective rating 1-10
  }

  calculateIntensity() {
    if (!this.difficulty || !this.duration) return 0;
    return (this.difficulty * this.duration) / 60; // intensity score per minute
  }
}
