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

      // classe d'état pour colorer le label/jauge
      const stateClass = employee.state === "malade" ? "state-malade" :
                         employee.state === "repos" ? "state-repos" : "state-actif";

      employeeDiv.innerHTML = `
        <div class="employee-row">
          <div class="employee-main">
            <strong>ID:</strong> ${employee.id} |
            <strong>Name:</strong> ${employee.name} |
            <strong>Rarity:</strong> ${employee.rarity} |
            <strong>EPS:</strong> ${employee.EPS} |
            <strong>ATK:</strong> ${employee.atk} |
            <strong>VITA:</strong> ${employee.vita} |
            <strong>INI:</strong> ${employee.ini}
          </div>

          <div class="employee-meta">
            <div class="focus-label">Focus: <span class="focus-value">${employee.focus}</span></div>
            <div class="focus-bar" aria-hidden="true">
              <div class="focus-fill ${employee.focus === 0 ? "focus-zero" : (employee.focus <= 20 ? "focus-low" : "")}" style="width:${employee.focus}%;"></div>
            </div>
            <div class="state-label ${stateClass}">État: ${employee.state}</div>
          </div>
        </div>
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
