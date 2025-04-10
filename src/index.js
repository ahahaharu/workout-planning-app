import { WorkoutPlanner } from "./classes/WorkoutPlanner.js";

const app = new WorkoutPlanner();

// Регистрация и логин пользователя
app.userReg("Андрей", "1111", "email@gmail.com", 70, "182"); // Регистрация пользователя
app.userLogin("email@gmail.com", "1111"); // Логин пользователя
app.showUsers(); // Показать всех пользователей

// Обновление параметров пользователя
app.updateWeight(72); // Обновить вес пользователя
app.updateProfile("Иван"); // Обновить профиль пользователя

// Создание силовых упражнений
app.createStrengthExercise("Жим блока ногами", null, "", null, "Ноги"); // Создание силового упражнения №1
app.createStrengthExercise("Жим лёжа", null, "", null, "Грудь"); // Создание силового упражнения №1

// Создание плана тренировки
app.createWorkoutPlan("Тренировка #1", "описание"); // Создание плана тренировки №1
app.showWorkoutPlans(); // Показать все планы тренировки

app.addExerciseToWorkoutPlan(0, 0); // Добавление силового упражнения №1 в план тренировки №1

app.addSetToExerciseInWorkoutPlan(0, 0, 10, 100); // Добавление сета 1 к силовому упражнению №1 в плане тренировки №1
app.addSetToExerciseInWorkoutPlan(0, 0, 10, 100); // Добавление сета 2 к силовому упражнению №1 в плане тренировки №1
app.addSetToExerciseInWorkoutPlan(0, 0, 10, 100); // Добавление сета 3 к силовому упражнению №1 в плане тренировки №1

app.showWorkoutPlans(); // Показать все планы тренировок
app.getWorkoutPlanExercises(0); // Получить все упражнения в плане тренировки №1

app.createWorkout(null, 0); // Создание тренировки №1 на основе плана тренировки №1

app.addExerciseToWorkout(0, 1); // Добавление силового упражнения №2 в тренировку №1

app.recordSetInWorkout(0, 1, 10, 50); // Запись сета 1 к силовому упражнению №2 в тренировке №1
app.recordSetInWorkout(0, 1, 10, 50); // Запись сета 2 к силовому упражнению №2 в тренировке №1
app.recordSetInWorkout(0, 1, 10, 50); // Запись сета 3 к силовому упражнению №2 в тренировке №1

app.getTotalWeightForWorkout(0); // Получить общий вес в тренировке №1

// Обновление сета в тренировке
app.updateSetInWorkout(0, 0, 0, 10, 120); // Обновление сета 1 к силовому упражнению №1 в тренировке №1
app.showWorkout(0); // Показать тренировку №1
app.getTotalWeightForWorkout(0); // Получить общий вес в тренировке №1

if (app.hasChangesFromPlan(0)) {
  app.updatePlanSetsInWorkout(0);
} // Обновление сетов в тренировке №1 на основе плана тренировки №1

app.createWorkout(null, 0); // Создание тренировки №2 на основе плана тренировки №1
app.addExerciseToWorkout(1, 1); // Добавление силового упражнения №1 в тренировку №2

app.recordSetInWorkout(1, 1, 10, 75); // Запись сета 1 к силовому упражнению №1 в тренировке №2
app.recordSetInWorkout(1, 1, 10, 75); // Запись сета 2 к силовому упражнению №1 в тренировке №2
app.recordSetInWorkout(1, 1, 10, 75); // Запись сета 3 к силовому упражнению №1 в тренировке №2

app.getTotalWeightForWorkout(0); // Получить общий вес в тренировке №1
app.getTotalWeightForWorkout(1); // Получить общий вес в тренировке №2

app.getUserWeightProgress(); // Получить прогресс по весу пользователя
app.getWorkoutProgress(); // Получить прогресс по всем тренировкам
app.getExerciseProgress(0); // Получить прогресс по силовому упражнению №1 в тренировке №1
app.getExerciseProgress(1); // Получить прогресс по силовому упражнению №2 в тренировке №1

app.createCardioExercise("Бег", null, "Бег на улице", null, "Running"); // Создание кардио упражнения
app.createWorkoutPlan("Кардио тренировка", "Кардио тренировка на улице"); // Создание плана тренировки №2
app.addExerciseToWorkoutPlan(1, 2); // Добавление кардио упражнения в план тренировки №2
app.addSessionToExerciseInWorkoutPlan(1, 2, 30, 5); // Добавление кардио сессии к кардио упражнению в плане тренировки №2
app.createWorkout(null, 1); // Создание тренировки №3 на основе плана тренировки №2
app.recordCardioSessionInWorkout(2, 2, 35, 5.2, 320); // Запись кардио сессии к кардио упражнению в тренировке №3
app.getCardioProgress(2); // Получить прогресс по кардио упражнению в тренировке №3

app.createEnduranceExercise(
  "Планка",
  null,
  "Классическая планка",
  null,
  "Core"
); // Создание упражнения на выносливость
app.createWorkoutPlan("Тренировка на выносливость", "Тренировка кора"); // Создание плана тренировки №3
app.addExerciseToWorkoutPlan(2, 3); // Добавление упражнения на выносливость в план тренировки №3
app.addEnduranceSessionToExerciseInWorkoutPlan(2, 3, 60, 7); // Добавление сессии к упражнению на выносливость в плане тренировки №3
app.createWorkout(null, 2); // Создание тренировки №4 на основе плана тренировки №3
app.recordEnduranceSessionInWorkout(3, 3, 75, 8); // Запись сессии к упражнению на выносливость в тренировке №4
app.getTotalEnduranceDurationForWorkout(3); // Получить общую продолжительность выносливости в тренировке №4
app.getMaxEnduranceDurationForWorkout(3); // Получить максимальную продолжительность выносливости в тренировке №4
app.getEnduranceTotalIntensityForWorkout(3); // Получить общую интенсивность выносливости в тренировке №4
app.getEnduranceProgress(3); // Получить прогресс по упражнению на выносливость в тренировке №4
