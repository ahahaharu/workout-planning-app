export class Statistics {
  constructor(user) {
    this.user = user;
    this.workouts = user?.workoutsHistory;
  }

  setUser(user) {
    this.user = user;
    this.workouts = user.workoutsHistory;
  }

  getUserWeightProgress(startDate = null, endDate = null) {
    const userWeightHistory = this.user.weightHistory;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const dateWeights = userWeightHistory.filter((weight) => {
      const weightDate = weight.date;
      return (!start || weightDate >= start) && (!end || weightDate <= end);
    });

    if (dateWeights.length === 0) {
      return {
        userWeightProgress: 0,
        dateWeights: [],
      };
    }

    const userWeightProgress =
      dateWeights[dateWeights.length - 1].weight - dateWeights[0].weight;

    return {
      userWeightProgress,
      dateWeights,
    };
  }

  getWorkoutsByDate(startDate = null, endDate = null) {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return this.workouts.filter((workout) => {
      const workoutDate = workout.date;
      return (!start || workoutDate >= start) && (!end || workoutDate <= end);
    });
  }

  getWorkoutProgress(startDate = null, endDate = null) {
    const workoutsByDate = this.getWorkoutsByDate(startDate, endDate);

    if (workoutsByDate.length === 0) {
      return {
        totalWeightProgress: 0,
        totalDistanceProgress: 0,
        totalDurationProgress: 0,
        workoutsByDate: [],
      };
    }

    const totalWeightProgress =
      workoutsByDate[workoutsByDate.length - 1].getTotalWeight() -
      workoutsByDate[0].getTotalWeight();

    const totalDistanceProgress =
      workoutsByDate[workoutsByDate.length - 1].getTotalDistance() -
      workoutsByDate[0].getTotalDistance();

    const totalDurationProgress =
      workoutsByDate[workoutsByDate.length - 1].getTotalDuration() -
      workoutsByDate[0].getTotalDuration();

    const progressByDate = workoutsByDate.map((workout) => ({
      date: workout.date,
      totalWeight: workout.getTotalWeight(),
      totalDistance: workout.getTotalDistance(),
      totalDuration: workout.getTotalDuration(),
    }));

    return {
      totalWeightProgress,
      totalDistanceProgress,
      totalDurationProgress,
      workoutsByDate: progressByDate,
    };
  }

  getExerciseProgress(exerciseId, startDate, endDate) {
    const workoutsByDate = this.getWorkoutsByDate(startDate, endDate);
    const exercises = [];
    const progress = [];

    for (const workout of workoutsByDate) {
      const exercise = workout.exercises.find(
        (exercise) => exercise.id === exerciseId
      );
      if (exercise) {
        exercises.push({
          date: workout.date,
          exercise: exercise,
        });
      }
    }

    if (exercises.length === 0) {
      return {
        progress: [],
        message: "No exercise data found for the specified period",
      };
    }

    // Check the exercise type and create appropriate progress data
    const exerciseType = exercises[0].exercise.type;

    if (exerciseType === "Strength") {
      exercises.forEach((item) => {
        progress.push({
          date: item.date,
          bestOneRepMax: item.exercise.getBestOneRepMax(),
          maxWeight: item.exercise.getMaxWeight(),
          totalWeight: item.exercise.getTotalWeight(),
        });
      });

      const bestOneReMaxProgress =
        exercises[exercises.length - 1].exercise.getBestOneRepMax() -
        exercises[0].exercise.getBestOneRepMax();
      const maxWeightProgress =
        exercises[exercises.length - 1].exercise.getMaxWeight() -
        exercises[0].exercise.getMaxWeight();
      const totalWeightProgress =
        exercises[exercises.length - 1].exercise.getTotalWeight() -
        exercises[0].exercise.getTotalWeight();

      return {
        bestOneReMaxProgress,
        maxWeightProgress,
        totalWeightProgress,
        progress: progress,
      };
    } else if (exerciseType === "Cardio") {
      exercises.forEach((item) => {
        progress.push({
          date: item.date,
          totalDistance: item.exercise.getTotalDistance(),
          totalDuration: item.exercise.getTotalDuration(),
          bestPace: item.exercise.getBestPace(),
          averagePace: item.exercise.getAveragePace(),
          bestSpeed: item.exercise.getBestSpeed(),
          averageSpeed: item.exercise.getAverageSpeed(),
          totalCalories: item.exercise.getTotalCalories(),
        });
      });

      const totalDistanceProgress =
        exercises[exercises.length - 1].exercise.getTotalDistance() -
        exercises[0].exercise.getTotalDistance();
      const totalDurationProgress =
        exercises[exercises.length - 1].exercise.getTotalDuration() -
        exercises[0].exercise.getTotalDuration();
      const bestPaceProgress =
        exercises[exercises.length - 1].exercise.getBestPace() -
        exercises[0].exercise.getBestPace();
      const bestSpeedProgress =
        exercises[exercises.length - 1].exercise.getBestSpeed() -
        exercises[0].exercise.getBestSpeed();
      const totalCaloriesProgress =
        exercises[exercises.length - 1].exercise.getTotalCalories() -
        exercises[0].exercise.getTotalCalories();

      return {
        totalDistanceProgress,
        totalDurationProgress,
        bestPaceProgress,
        bestSpeedProgress,
        totalCaloriesProgress,
        progress: progress,
      };
    }
  }
}
