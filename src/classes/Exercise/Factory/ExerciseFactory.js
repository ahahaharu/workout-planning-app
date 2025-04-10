import { CardioExercise } from "../CardioExercise.js";
import { ExerciseType } from "../Constants/ExerciseType.js";
import { EnduranceExercise } from "../EnduranceExercise.js";
import { StrengthExercise } from "../StrengthExercise.js";

export class ExerciseFactory {
  static createExercise(
    type,
    id,
    name,
    image,
    description,
    mediaUrl,
    specificParam
  ) {
    switch (type) {
      case ExerciseType.STRENGTH:
        return this.createStrengthExercise(
          id,
          name,
          image,
          description,
          mediaUrl,
          specificParam
        );
      case ExerciseType.CARDIO:
        return this.createCardioExercise(
          id,
          name,
          image,
          description,
          mediaUrl,
          specificParam
        );
      case ExerciseType.ENDURANCE:
        return this.createEnduranceExercise(
          id,
          name,
          image,
          description,
          mediaUrl,
          specificParam
        );
      default:
        throw new Error(`Неподдерживаемый тип упражнения: ${type}`);
    }
  }

  static createStrengthExercise(
    id,
    name,
    image,
    description,
    mediaUrl,
    bodyPart,
    sets = []
  ) {
    return new StrengthExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      ExerciseType.STRENGTH,
      bodyPart,
      sets
    );
  }

  static createCardioExercise(
    id,
    name,
    image,
    description,
    mediaUrl,
    cardioType
  ) {
    return new CardioExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      ExerciseType.CARDIO,
      cardioType
    );
  }

  static createEnduranceExercise(
    id,
    name,
    image,
    description,
    mediaUrl,
    targetMuscle
  ) {
    return new EnduranceExercise(
      id,
      name,
      image,
      description,
      mediaUrl,
      ExerciseType.ENDURANCE,
      targetMuscle
    );
  }
}
