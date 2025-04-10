export class Set {
  constructor(reps, weight = null) {
    this.reps = reps;
    this.weight = weight;
  }

  calculateOneRepMax() {
    if (!this.weight || !this.reps) return 0;
    return Math.round(this.weight * (1 + this.reps / 30));
  }
}
