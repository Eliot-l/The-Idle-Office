import { EmployeeModel } from "../models/employeeModel.js";
import { EmployeeView } from "../views/employeeView.js";

export class EmployeeController {
  constructor() {
    this.model = new EmployeeModel();
    this.view = new EmployeeView();
  }

  init() {
    this.view.displayCreateButton(() => this.handleCreateEmployee());
    this.renderEmployees();
  }

  handleCreateEmployee() {
    const NAMES = [
      "Cyril", "Enzo", "Kyllian", "Fred", "Noa",
      "Loic", "Alex", "Quentin", "Bastien", "Théo",
    ];
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    const employee = this.model.addEmployee(randomName);

    // Ajouter l'employé au modèle global
    const gameModel = new GameModel(); // Accéder au modèle global
    gameModel.getState().employees.push(employee);

    this.renderEmployees();
  }

  renderEmployees() {
    const employees = this.model.getEmployees();
    this.view.displayEmployees(employees);
  }
}