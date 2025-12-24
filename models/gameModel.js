export class GameModel {
  constructor() {
    this.state = {
      studies: 0,
    };
  }

  getState() {
    return this.state;
  }

  addStudies(amount) {
    this.state.studies += amount;
  }
}
