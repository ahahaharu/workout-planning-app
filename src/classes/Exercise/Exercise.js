export class Exercise {
  constructor(id, name, image, description, mediaUrl, type) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description || "";
    this.mediaUrl = mediaUrl;
    this.type = type;
    this.notes = [];
  }

  updateExercise(name, description, mediaUrl) {
    this.name = name || this.name;
    this.description = description || this.description;
    this.mediaUrl = mediaUrl || this.mediaUrl;
  }

  addNote(note) {
    this.notes.push(note);
  }
}
