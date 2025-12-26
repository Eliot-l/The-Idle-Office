import { Employee } from "./employee.js"; // Mise à jour du chemin

/** Modèle responsable de la gestion des employés */
export class EmployeeModel {
  constructor() {
    this.employees = []; // Liste pour stocker les employés
  }

  // Ajouter un employé basé sur un nom donné
  addEmployee(name) {
    const id = this.employees.length + 1; // Générer un ID unique
    const newEmployee = new Employee({ id, name }); // Créer un employé à partir du nom
    this.employees.push(newEmployee); // Ajouter à la liste des employés
  }

  // Récupérer tous les employés existants
  getEmployees() {
    return this.employees;
  }
}