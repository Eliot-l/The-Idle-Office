import { GameModel } from "../models/gameModel.js";
import { GameView } from "../views/gameView.js";
import { EmployeeController } from "./employeeController.js";

export class MainController {
  constructor() {
    this.model = new GameModel();
    this.view = new GameView();
    this.employeeController = new EmployeeController();
  }

  init() {
    this.renderAll();

    this.view.bindProduce(() => {
      this.model.addStudies(1);
      this.renderHUD();
    });

    this.employeeController.init();
  }

  renderAll() {
    this.view.render(this.model.getState(), this.getDerived());
    this.employeeController.renderEmployees();
  }

  renderHUD() {
    const state = this.model.getState();
    const derived = this.getDerived();
    this.view.updateHUD({ studies: state.studies, eps: derived.eps });
  }

  getDerived() {
    return { eps: this.model.getEps() };
  }
}