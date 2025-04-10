import { ExerciseType } from "../Constants/ExerciseType.js";
import { StrengthExerciseStrategy } from "./StrengthExerciseStrategy.js";
import { CardioExerciseStrategy } from "./CardioExerciseStrategy.js";
import { EnduranceExerciseStrategy } from "./EnduranceExerciseStrategy.js";

export class ExerciseStrategyFactory {
  constructor() {
    this.strategies = {
      [ExerciseType.STRENGTH]: new StrengthExerciseStrategy(),
      [ExerciseType.CARDIO]: new CardioExerciseStrategy(),
      [ExerciseType.ENDURANCE]: new EnduranceExerciseStrategy(),
    };
  }

  getStrategy(exerciseType) {
    const strategy = this.strategies[exerciseType];
    if (!strategy) {
      throw new Error(`No strategy found for exercise type: ${exerciseType}`);
    }
    return strategy;
  }

  registerStrategy(exerciseType, strategy) {
    this.strategies[exerciseType] = strategy;
  }
}
