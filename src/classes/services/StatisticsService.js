import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";

export class StatisticsService {
  constructor(userService, workoutService) {
    this.userService = userService;
    this.workoutService = workoutService;
  }

  getUserWeightProgress(userId, startDate = null, endDate = null) {
    const user = this.userService.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userWeightHistory = user.weightHistory;
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

  getWorkoutsByDate(userId, startDate = null, endDate = null) {
    const workouts = this.workoutService.getWorkoutsForUser(userId);

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return workouts.filter((workout) => {
      const workoutDate = workout.date;
      return (!start || workoutDate >= start) && (!end || workoutDate <= end);
    });
  }

  getWorkoutProgress(userId, startDate = null, endDate = null) {
    const workoutsByDate = this.getWorkoutsByDate(userId, startDate, endDate);

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

  getExerciseProgress(userId, exerciseId, startDate = null, endDate = null) {
    const workoutsByDate = this.getWorkoutsByDate(userId, startDate, endDate);
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

    const exerciseType = exercises[0].exercise.type;

    return this.getExerciseProgressByType(exerciseType, exercises);
  }

  getExerciseProgressByType(exerciseType, exercises) {
    if (exerciseType === ExerciseType.STRENGTH) {
      return this.getStrengthExerciseProgress(exercises);
    } else if (exerciseType === ExerciseType.CARDIO) {
      return this.getCardioExerciseProgress(exercises);
    } else if (exerciseType === ExerciseType.ENDURANCE) {
      return this.getEnduranceExerciseProgress(exercises);
    } else {
      throw new Error(`Unknown exercise type: ${exerciseType}`);
    }
  }

  getStrengthExerciseProgress(exercises) {
    const progress = [];

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
  }

  getCardioExerciseProgress(exercises) {
    const progress = [];

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

  getEnduranceExerciseProgress(exercises) {
    const progress = [];

    exercises.forEach((item) => {
      progress.push({
        date: item.date,
        totalDuration: item.exercise.getTotalDuration(),
        maxDuration: item.exercise.getMaxDuration(),
        averageDifficulty: item.exercise.getAverageDifficulty(),
        totalIntensity: item.exercise.getTotalIntensity(),
        averageIntensity: item.exercise.getAverageIntensity(),
      });
    });

    const totalDurationProgress =
      exercises[exercises.length - 1].exercise.getTotalDuration() -
      exercises[0].exercise.getTotalDuration();
    const maxDurationProgress =
      exercises[exercises.length - 1].exercise.getMaxDuration() -
      exercises[0].exercise.getMaxDuration();
    const averageDifficultyProgress =
      exercises[exercises.length - 1].exercise.getAverageDifficulty() -
      exercises[0].exercise.getAverageDifficulty();
    const totalIntensityProgress =
      exercises[exercises.length - 1].exercise.getTotalIntensity() -
      exercises[0].exercise.getTotalIntensity();

    return {
      totalDurationProgress,
      maxDurationProgress,
      averageDifficultyProgress,
      totalIntensityProgress,
      progress: progress,
    };
  }

  getUserStatisticsSummary(userId, startDate = null, endDate = null) {
    const weightProgress = this.getUserWeightProgress(
      userId,
      startDate,
      endDate
    );
    const workoutProgress = this.getWorkoutProgress(userId, startDate, endDate);

    const user = this.userService.getUserById(userId);
    const currentWeight = user ? user.currentWeight : null;
    const initialWeight =
      user && user.weightHistory.length > 0
        ? user.weightHistory[0].weight
        : null;

    return {
      weightMetrics: {
        initialWeight,
        currentWeight,
        change: weightProgress.userWeightProgress,
        history: weightProgress.dateWeights,
      },
      workoutMetrics: {
        totalWorkouts: workoutProgress.workoutsByDate.length,
        totalWeightLifted: workoutProgress.workoutsByDate.reduce(
          (sum, workout) => sum + workout.totalWeight,
          0
        ),
        totalDistanceCovered: workoutProgress.workoutsByDate.reduce(
          (sum, workout) => sum + workout.totalDistance,
          0
        ),
        totalDurationSpent: workoutProgress.workoutsByDate.reduce(
          (sum, workout) => sum + workout.totalDuration,
          0
        ),
        progress: workoutProgress,
      },
    };
  }
}
