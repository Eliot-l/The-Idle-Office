import { EmployeeModel } from "../models/employeeModel.js";
import { EmployeeView } from "../views/employeeView.js";

export class EmployeeController {
  constructor() {
    this.model = new EmployeeModel(); // Modèle pour stocker les employés
    this.view = new EmployeeView();   // Vue pour afficher les employés
  }

  init() {
    // Afficher le bouton pour créer un employé
    this.view.displayCreateButton(() => this.handleCreateEmployee());

    // Afficher la liste initiale d'employés
    this.renderEmployees();
  }

  handleCreateEmployee() {
    const NAMES = [
      "Cyril", "Enzo", "Kyllian", "Fred", "Noa", 
      "Loic", "Alex", "Quentin", "Bastien", "Théo",
      "Florian", "Brice", "Paul", "Georges", "Sarah", "Tim", "Eliot",
    ];
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    this.model.addEmployee(randomName); // Ajouter un nouvel employé au modèle

    // Rafraîchir l'affichage
    this.renderEmployees();
  }

  renderEmployees() {
    const employees = this.model.getEmployees(); // Récupérer les employés
    this.view.displayEmployees(employees);      // Les afficher dans la vue
  }
}