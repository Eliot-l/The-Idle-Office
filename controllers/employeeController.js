import { EmployeeModel } from "../models/employeeModel.js";
import { EmployeeView } from "../views/employeeView.js";
import { EMPLOYEE_DATA } from "../models/employee.js";

export class EmployeeController {
  // maintenant on reçoit gameModel ET gachaService
  constructor(gameModel, gachaService) {
    this.model = new EmployeeModel();
    this.view = new EmployeeView();
    this.gameModel = gameModel; // instance du GameModel global
    this.gacha = gachaService;  // instance du GachaService
  }

  init() {
    this.view.displayCreateButton(() => this.handleCreateEmployee());
    this.renderEmployees();
  }

  handleCreateEmployee() {
    // obtenir rarity via GachaService
    const rarity = this.gacha ? this.gacha.rollRarity() : 1;

    // choisir un candidat dans EMPLOYEE_DATA correspondant à la rarity
    const candidates = EMPLOYEE_DATA.filter((e) => e.rarity === rarity);
    if (candidates.length === 0) {
      console.error("Aucun employé pour la rarity", rarity);
      return;
    }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    // création via EmployeeModel (retourne instance Employee)
    const employee = this.model.addEmployee(chosen.name);
    if (!employee) {
      console.error("Création d'employé a échoué.");
      return;
    }

    // synchroniser état global (GameModel)
    const state = this.gameModel.getState();
    state.employees = state.employees || [];
    state.employees.push(employee);

    // sauvegarder l'état si le model propose save
    if (typeof this.gameModel.save === "function") this.gameModel.save();

    this.renderEmployees();
  }

  renderEmployees() {
    const employees = this.model.getEmployees();
    this.view.displayEmployees(employees);
  }
}
