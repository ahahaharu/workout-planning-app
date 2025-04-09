export class ExerciseStrategy {
  copyExercise(exercise) {
    throw new Error("Method must be implemented by concrete strategy");
  }

  addTrackingData(exercise, data) {
    throw new Error("Method must be implemented by concrete strategy");
  }

  updateTrackingData(exercise, index, data) {
    throw new Error("Method must be implemented by concrete strategy");
  }

  getStatistics(exercise) {
    throw new Error("Method must be implemented by concrete strategy");
  }

  calculateProgress(firstExercise, lastExercise) {
    throw new Error("Method must be implemented by concrete strategy");
  }

  hasChanges(exercise, planExercise) {
    throw new Error("Method must be implemented by concrete strategy");
  }

  updatePlanData(source, target) {
    throw new Error("Method must be implemented by concrete strategy");
  }
}
