import { GameModel } from "../models/gameModel.js";
import { GameView } from "../views/gameView.js";
import { EmployeeController } from "./employeeController.js"; // Import du EmployeeController

export class MainController {
  constructor() {
    this.model = new GameModel();
    this.view = new GameView();

    this.employeeController = new EmployeeController(); // Initialisation du EmployeeController

    this.autosaveHandle = null;
    this.lastTimeMs = null;
    this.rafId = null;
  }

  init() {
    this.renderAll();

    // Initialiser le EmployeeController
    this.employeeController.init();

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
    this.renderEmployees(); // Rendre les employés si nécessaire
    this.view.render(this.model.getState(), this.getDerived());
  }

  renderHUD() {
    const state = this.model.getState();
    const derived = this.getDerived();
    this.view.updateHUD({ studies: state.studies, eps: derived.eps });
  }

  renderEmployees() {
    this.employeeController.renderEmployees(); // Appeler le render pour les employés
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