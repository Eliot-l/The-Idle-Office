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
      "Florian", "Brice", "Paul", "Georges", "Sarah", "Tim", "Eliot",
    ];
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    this.model.addEmployee(randomName);
    this.renderEmployees();
  }

  renderEmployees() {
    const employees = this.model.getEmployees();
    this.view.displayEmployees(employees);
  }
}