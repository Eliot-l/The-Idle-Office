export class EmployeeView {
  displayEmployees(employees) {
    const container = document.getElementById("employee-list");
    if (!container) {
      console.error("Conteneur #employee-list non trouvé dans le DOM.");
      return;
    }
    container.innerHTML = "";
    employees.forEach((employee) => {
      const employeeDiv = document.createElement("div");
      employeeDiv.className = "employee";
      employeeDiv.innerHTML = `
        <strong>ID:</strong> ${employee.id} |
        <strong>Name:</strong> ${employee.name} |
        <strong>Rarity:</strong> ${employee.rarity} |
        <strong>EPS:</strong> ${employee.EPS} |
        <strong>ATK:</strong> ${employee.atk} |
        <strong>VITA:</strong> ${employee.vita} |
        <strong>INI:</strong> ${employee.ini}
      `;
      container.appendChild(employeeDiv);
    });
  }

  displayCreateButton(onClick) {
    const button = document.getElementById("create-employee-button");
    if (!button) {
      console.error("Bouton #create-employee-button non trouvé dans le DOM.");
      return;
    }
    button.addEventListener("click", onClick);
  }
}