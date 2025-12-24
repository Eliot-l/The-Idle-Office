import { GameModel } from "../models/gameModel.js";
import { GameView } from "../views/gameView.js";

export class MainController {
  constructor() {
    this.model = new GameModel();
    this.view = new GameView();

    this.autosaveHandle = null;
    this.lastTimeMs = null;
    this.rafId = null;
  }

  init() {
    this.renderAll();

    this.view.bindProduce(() => {
      this.model.addStudies(1);
      this.model.save();
      this.renderHUD();
    });

    // Autosave
    this.autosaveHandle = setInterval(() => this.model.save(), 10_000);
    window.addEventListener("beforeunload", () => this.model.save());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") this.model.save();
    });

    this.startLoop();
  }

  getDerived() {
    return { eps: this.model.getEps() };
  }

  renderAll() {
    this.view.render(this.model.getState(), this.getDerived());
  }

  renderHUD() {
    const state = this.model.getState();
    const derived = this.getDerived();
    this.view.updateHUD({ studies: state.studies, eps: derived.eps });
  }

  startLoop() {
    const step = (timeMs) => {
      if (this.lastTimeMs == null) this.lastTimeMs = timeMs;
      const deltaSeconds = Math.min(0.25, (timeMs - this.lastTimeMs) / 1000);
      this.lastTimeMs = timeMs;

      this.model.tick(deltaSeconds);
      this.renderHUD();

      this.rafId = requestAnimationFrame(step);
    };

    this.rafId = requestAnimationFrame(step);
  }
}
