import { GameModel } from "../models/gameModel.js";
import { GameView } from "../views/gameView.js";
import { EmployeeController } from "./employeeController.js";
import { GachaService } from "../services/gachaService.js";

export class MainController {
  constructor() {
    this.model = new GameModel();
    // initialiser GachaService en réutilisant le state sauvegardé s'il existe
    const pityState = this.model.getState().pity ?? null;
    this.gacha = new GachaService(pityState, (newPity) => {
      // synchroniser dans le model et sauvegarder
      this.model.getState().pity = newPity;
      this.model.save();
    });

    this.view = new GameView();
    this.employeeController = new EmployeeController(this.model, this.gacha);
    this.lastTimeMs = null;
    this.rafId = null;
  }

  init() {
    this.renderAll();

    this.view.bindProduce(() => {
      this.model.addStudies(1);
      this.renderHUD();
    });

    // Lier les boutons de test/dev
    this.view.bindDevControls(
      () => { // Ajouter 10000 études
        this.model.addStudies(10000);
        this.renderHUD();
      },
      () => { // Réinitialiser tout
        this.model.reset();
        // reset gacha/pity et synchroniser dans le model
        if (this.gacha) {
          this.gacha.reset();
          this.model.getState().pity = this.gacha.getState();
        }
        // Vider la liste d'employés locale au controller et dans le state global
        if (this.employeeController?.model) this.employeeController.model.employees = [];
        if (this.model?.getState) this.model.getState().employees = [];
        this.model.save?.();
        this.renderAll();
      }
    );

    this.employeeController.init();
    this.startLoop();
  }

  renderAll() {
    this.renderHUD();
    this.employeeController.renderEmployees();
  }

  renderHUD() {
    const state = this.model.getState();
    const derived = { eps: this.model.getEps() };
    const pityRemaining = this.gacha ? this.gacha.getRemaining() : null;
    this.view.updateHUD({ studies: state.studies, eps: derived.eps, pityRemaining });
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
