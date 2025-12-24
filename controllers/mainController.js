import { GameModel } from "../models/gameModel.js";
import { GameView } from "../views/gameView.js";

export class MainController {
  constructor() {
    this.model = new GameModel();
    this.view = new GameView();

    this.autosaveHandle = null;
  }

  init() {
    this.view.render(this.model.getState());

    this.view.bindProduce(() => {
      this.model.addStudies(1);
      this.view.updateStudies(this.model.getState().studies);
      this.model.save(); // save immédiat sur action
    });

    // Autosave toutes les 10s (sécurise même si crash/onglet fermé)
    this.autosaveHandle = setInterval(() => this.model.save(), 10_000);

    // Save quand l’onglet se ferme / change
    window.addEventListener("beforeunload", () => this.model.save());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") this.model.save();
    });
  }
}
