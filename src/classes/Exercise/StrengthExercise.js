import { Exercise } from "./Exercise.js";
import { Set } from "./Set.js";

export class StrengthExercise extends Exercise {
  constructor(id, name, image, description, mediaUrl, type, bodyPart, sets) {
    super(id, name, image, description, mediaUrl, type);
    this.bodyPart = bodyPart;
    this.sets = sets || [];
  }

  addSet(reps, weight) {
    this.sets.push(new Set(reps, weight));
  }

  removeSet(setIndex) {
    this.sets.splice(setIndex, 1);
  }

  getSets() {
    return this.sets;
  }

  updateSet(index, reps, weight) {
    this.sets[index].reps = reps || this.sets[index].reps;
    this.sets[index].weight = weight || this.sets[index].weight;
  }

  getAverageOneRepMax() {
    return (
      this.sets.reduce((acc, val) => acc + val.calculateOneRepMax(), 0) /
      this.sets.length
    );
  }

  getBestOneRepMax() {
    return Math.max(...this.sets.map((set) => set.calculateOneRepMax()));
  }

  getMaxWeight() {
    return Math.max(...this.sets.map((set) => set.weight));
  }

  getTotalWeight() {
    return this.sets.reduce(
      (acc, set) => acc + (set.weight || 0) * set.reps,
      0
    );
  }
}
