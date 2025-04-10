export class CardioSession {
  constructor(duration, distance, caloriesBurned = null) {
    this.duration = duration; // in minutes
    this.distance = distance; // in kilometers
    this.caloriesBurned = caloriesBurned;
  }

  calculatePace() {
    if (!this.distance || this.distance === 0) return 0;
    return this.duration / this.distance; // minutes per kilometer
  }

  calculateSpeed() {
    if (!this.duration || this.duration === 0) return 0;
    return (this.distance / this.duration) * 60; // km/h
  }
}
