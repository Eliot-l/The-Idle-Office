import { GameModel } from "../models/gameModel.js";
import { GameView } from "../views/gameView.js";

export class MainController {
  constructor() {
    this.model = new GameModel();
    this.view = new GameView();
  }

  init() {
    this.view.render(this.model.getState());

    this.view.bindProduce(() => {
      this.model.addStudies(1);
      this.view.updateStudies(this.model.getState().studies);
    });
  }
}
