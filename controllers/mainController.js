import { GameModel } from "../models/gameModel.js";
import { GameView } from "../views/gameView.js";
import { EmployeeController } from "./employeeController.js";

export class MainController {
  constructor() {
    this.model = new GameModel();
    this.view = new GameView();
    this.employeeController = new EmployeeController();
    this.lastTimeMs = null;
    this.rafId = null;
    console.log("GameModel attaché à MainController :", this.model);
  }

  init() {
    this.renderAll();

    this.view.bindProduce(() => {
      this.model.addStudies(1);
      this.renderHUD();
    });

    this.employeeController.init();
    this.startLoop(); // Démarrer la boucle
  }

  renderAll() {
    this.renderHUD();
    this.employeeController.renderEmployees();
  }

  renderHUD() {
    const state = this.model.getState();
    const derived = { eps: this.model.getEps() }; // EPS dérivé
    this.view.updateHUD({ studies: state.studies, eps: derived.eps });
  }

  startLoop() {
    const step = (timeMs) => {
      if (this.lastTimeMs == null) this.lastTimeMs = timeMs;
      const deltaSeconds = Math.min(0.25, (timeMs - this.lastTimeMs) / 1000);
      this.lastTimeMs = timeMs;

      this.model.tick(deltaSeconds); // Calculer la production en temps réel
      this.renderHUD(); // Mettre à jour le HUD

      this.rafId = requestAnimationFrame(step);
    };

    this.rafId = requestAnimationFrame(step);
  }
}