import { Exercise } from "./Exercise.js";

export class CardioExercise extends Exercise {
  constructor(
    id,
    name,
    image,
    description,
    mediaUrl,
    type,
    duration,
    distance
  ) {
    super(id, name, image, description, mediaUrl, type);
    this.duration = duration;
    this.distance = distance;
  }
}
