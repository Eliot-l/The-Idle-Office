export class EmployeeView {
  displayEmployees(employees) {
    const container = document.getElementById("employee-list");
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
    button.addEventListener("click", onClick);
  }
}