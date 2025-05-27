import { ExerciseType } from "../Exercise/Constants/ExerciseType.js";
import { ExerciseStrategyFactory } from "../Exercise/Strategies/ExerciseStrategyFactory.js";

export class StatisticsService {
  constructor(userService, workoutService) {
    this.userService = userService;
    this.workoutService = workoutService;
    this.strategyFactory = new ExerciseStrategyFactory();
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

    const firstExercise = exercises[0].exercise;

    try {
      const strategy = this.strategyFactory.getStrategy(firstExercise.type);

      const progressData = exercises.map((item) => {
        return {
          date: item.date,
          exerciseId: item.exercise.id,
          ...strategy.getStatistics(item.exercise),
        };
      });

      const progressMetrics = strategy.calculateProgress(
        exercises[0].exercise,
        exercises[exercises.length - 1].exercise
      );

      const exerciseType = firstExercise.type.toUpperCase();
      let additionalMetrics = {};

      if (exerciseType === "ENDURANCE" || exerciseType === "ENDURANCE") {
        if (
          !progressMetrics.intensityProgress &&
          progressMetrics.totalIntensityProgress
        ) {
          additionalMetrics.intensityProgress =
            progressMetrics.totalIntensityProgress;
        }
      } else if (exerciseType === "CARDIO" || exerciseType === "CARDIO") {
        if (
          !progressMetrics.distanceProgress &&
          progressMetrics.totalDistanceProgress
        ) {
          additionalMetrics.distanceProgress =
            progressMetrics.totalDistanceProgress;
        }
        if (
          !progressMetrics.durationProgress &&
          progressMetrics.totalDurationProgress
        ) {
          additionalMetrics.durationProgress =
            progressMetrics.totalDurationProgress;
        }
      }

      return {
        ...progressMetrics,
        ...additionalMetrics,
        progress: progressData,
      };
    } catch (error) {
      console.error(`Error calculating progress: ${error.message}`);
      return {
        progress: [],
        message: `Error calculating progress: ${error.message}`,
      };
    }
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
