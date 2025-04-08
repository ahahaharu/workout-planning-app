class Statistics {
  constructor(user) {
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
        workoutsByDate: [],
      };
    }

    const totalWeightProgress =
      workoutsByDate[workoutsByDate.length - 1].getTotalWeight() -
      workoutsByDate[0].getTotalWeight();

    const progressByDate = workoutsByDate.map((workout) => ({
      date: workout.date,
      totalWeight: workout.getTotalWeight(),
    }));

    return {
      totalWeightProgress,
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

    exercises.forEach((exercise) => {
      progress.push({
        date: exercise.date,
        bestOneRepMax: exercise.getBestOneRepMax(),
        maxWeight: exercise.maxWeight(),
        totalWeight: exercise.getTotalWeight(),
      });
    });
    return progress;
  }
}
