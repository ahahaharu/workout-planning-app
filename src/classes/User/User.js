export class User {
  constructor(id, name, password, email, currentWeight, height) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.email = email;
    this.currentWeight = currentWeight;
    this.weightHistory = [{ date: new Date(), weight: currentWeight }];
    this.height = height;
    this.workoutsHistory = [];
    this.workoutPlans = [];
  }

  updateWeight(newWeight) {
    this.currentWeight = newWeight;
    this.weightHistory.push({ date: new Date(), weight: newWeight });
  }

  addWorkoutPlan(workoutPlan) {
    this.workoutPlans.push(workoutPlan);
  }

  getWorkoutPlans() {
    return this.workoutPlans;
  }

  addWorkout(workout) {
    this.workoutsHistory.push(workout);
  }

  getWorkoutHistory() {
    return this.workoutsHistory;
  }

  updateProfile(name, password, email, height) {
    this.name = name || this.name;
    this.password = password || this.password;
    this.email = email || this.email;
    this.height = height || this.height;
  }
}
