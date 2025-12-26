export class EmployeeView {
  constructor() {
    this.employeeListContainer = document.getElementById("employee-list"); // Conteneur pour afficher les employés
    this.createButtonContainer = document.getElementById("button-container"); // Conteneur pour le bouton
  }

  // Afficher tous les employés dans le DOM
  displayEmployees(employees) {
    this.employeeListContainer.innerHTML = ""; // Nettoyer la liste avant de mettre à jour

    employees.forEach((employee) => {
      const employeeElement = document.createElement("div");
      employeeElement.className = "employee";
      employeeElement.innerHTML = `
        <strong>ID:</strong> ${employee.id} |
        <strong>Name:</strong> ${employee.name} |
        <strong>Rarity:</strong> ${employee.rarity} |
        <strong>Type:</strong> ${employee.type} |
        <strong>EPS:</strong> ${employee.EPS} |
        <strong>ATK:</strong> ${employee.atk} |
        <strong>VITA:</strong> ${employee.vita} |
        <strong>INI:</strong> ${employee.ini}
      `;
      this.employeeListContainer.appendChild(employeeElement);
    });
  }

  // Afficher le bouton de création d'employé
  displayCreateButton(onClick) {
    const button = document.createElement("button");
    button.id = "create-employee-button";
    button.className = "create-button";
    button.innerText = "Créer un employé aléatoire";
    button.addEventListener("click", onClick);
    this.createButtonContainer.appendChild(button);
  }
}