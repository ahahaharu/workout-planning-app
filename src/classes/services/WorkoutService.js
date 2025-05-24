import { Workout } from "../Workout/Workout.js";

export class WorkoutService {
  constructor(exerciseService, workoutPlanService, storageManager) {
    this.exerciseService = exerciseService;
    this.workoutPlanService = workoutPlanService;
    this.storageManager = storageManager;
    this.workouts = this.storageManager.getWorkouts() || [];
    
    // Десериализация объектов Workout из localStorage
    this._deserializeWorkouts();
  }

  _deserializeWorkouts() {
    // Преобразуем простые объекты из localStorage в экземпляры класса Workout
    this.workouts = this.workouts.map(workoutData => {
      let plan = null;
      
      // Если у тренировки есть связанный план, находим его
      if (workoutData.plan && workoutData.plan.id !== undefined) {
        plan = this.workoutPlanService.getWorkoutPlanById(workoutData.plan.id);
      }
      
      // Создаем объект тренировки
      const workout = new Workout(
        workoutData.id,
        workoutData.ownerId,
        new Date(workoutData.date),
        plan
      );
      
      // Если в данных есть упражнения, но нет плана (или упражнения добавлены вручную)
      if (workoutData.exercises && workoutData.exercises.length) {
        workoutData.exercises.forEach(exerciseData => {
          // Если упражнение еще не добавлено из плана
          if (!workout.getExerciseById(exerciseData.id)) {
            // Находим оригинальное упражнение из сервиса упражнений
            const originalExercise = this.exerciseService.getExerciseById(exerciseData.id);
            if (originalExercise) {
              // Добавляем упражнение в тренировку
              const workoutExercise = workout.addExercise(originalExercise);
              
              // Копируем данные тренировки в зависимости от типа упражнения
              if (exerciseData.sets && exerciseData.sets.length) {
                exerciseData.sets.forEach(set => {
                  workout.recordSet(exerciseData.id, set.reps, set.weight);
                });
              } 
              else if (exerciseData.sessions && exerciseData.sessions.length) {
                if (exerciseData.type === "Cardio") {
                  exerciseData.sessions.forEach(session => {
                    workout.recordCardioSession(
                      exerciseData.id,
                      session.duration,
                      session.distance,
                      session.caloriesBurned
                    );
                  });
                } 
                else if (exerciseData.type === "Endurance") {
                  exerciseData.sessions.forEach(session => {
                    workout.recordEnduranceSession(
                      exerciseData.id,
                      session.duration,
                      session.difficulty
                    );
                  });
                }
              }
            }
          }
        });
      }
      
      return workout;
    });
  }

  _saveWorkouts() {
    this.storageManager.saveWorkouts(this.workouts);
  }

  generateWorkoutId() {
    if (!this.workouts.length) return 0;
    return Math.max(...this.workouts.map(workout => workout.id)) + 1;
  }

  createWorkout(ownerId, date = null, workoutPlanId) {
    let plan = null;
    if (workoutPlanId !== undefined) {
      plan = this.workoutPlanService.getWorkoutPlanById(workoutPlanId);
      if (!plan) {
        throw new Error(`План тренировки с ID ${workoutPlanId} не найден`);
      }
    }

    const id = this.generateWorkoutId();
    const workout = new Workout(id, ownerId, date || new Date(), plan);

    this.workouts.push(workout);
    this._saveWorkouts();
    return workout;
  }

  addExerciseToWorkout(workoutId, exerciseId) {
    const workout = this.getWorkoutById(workoutId);
    const exercise = this.exerciseService.getExerciseById(exerciseId);

    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    if (!exercise) {
      throw new Error(`Упражнение с ID ${exerciseId} не найдено`);
    }

    const addedExercise = workout.addExercise(exercise);
    this._saveWorkouts();
    return workout;
  }

  recordSetInWorkout(workoutId, exerciseId, reps, weight) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.recordSet(exerciseId, reps, weight);
    this._saveWorkouts();
  }

  updateSetInWorkout(workoutId, exerciseId, setIndex, reps, weight) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.updateSet(exerciseId, setIndex, reps, weight);
    this._saveWorkouts();
  }

  recordCardioSessionInWorkout(
    workoutId,
    exerciseId,
    duration,
    distance,
    caloriesBurned = null
  ) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.recordCardioSession(exerciseId, duration, distance, caloriesBurned);
    this._saveWorkouts();
  }

  updateCardioSessionInWorkout(
    workoutId,
    exerciseId,
    sessionIndex,
    duration,
    distance,
    caloriesBurned
  ) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.updateCardioSession(
      exerciseId,
      sessionIndex,
      duration,
      distance,
      caloriesBurned
    );
    this._saveWorkouts();
  }

  recordEnduranceSessionInWorkout(
    workoutId,
    exerciseId,
    duration,
    difficulty = null
  ) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.recordEnduranceSession(exerciseId, duration, difficulty);
    this._saveWorkouts();
  }

  updateEnduranceSessionInWorkout(
    workoutId,
    exerciseId,
    sessionIndex,
    duration,
    difficulty
  ) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }

    workout.updateEnduranceSession(
      exerciseId,
      sessionIndex,
      duration,
      difficulty
    );
    this._saveWorkouts();
  }

  getWorkoutById(workoutId) {
    return this.workouts.find((workout) => workout.id === workoutId);
  }

  getWorkoutsForUser(userId) {
    return this.workouts.filter((workout) => workout.ownerId === userId);
  }

  getAllWorkouts() {
    return this.workouts;
  }

  getTotalWeightForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }
    return workout.getTotalWeight();
  }

  getTotalDistanceForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }
    return workout.getTotalDistance();
  }

  getTotalDurationForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }
    return workout.getTotalDuration();
  }

  getTotalEnduranceDurationForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }
    return workout.getTotalEnduranceDuration();
  }

  getMaxEnduranceDurationForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }
    return workout.getMaxEnduranceDuration();
  }

  getEnduranceTotalIntensityForWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }
    return workout.getTotalEnduranceIntensity();
  }

  hasChangesFromPlan(workoutId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }
    return workout.hasChangesFromPlan();
  }

  updatePlanSetsInWorkout(workoutId) {
    const workout = this.getWorkoutById(workoutId);
    if (!workout) {
      throw new Error(`Тренировка с ID ${workoutId} не найдена`);
    }
    const result = workout.updatePlanSets();
    this._saveWorkouts();
    return result;
  }
}