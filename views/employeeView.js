export class EmployeeView {
  constructor() {
    this.onToggleAssign = null;
  }

  displayEmployees(employees, agency = null) {
    const poolContainer = document.getElementById("employee-list");
    if (!poolContainer) {
      console.error("Conteneur #employee-list non trouvé dans le DOM.");
      return;
    }

    const assignedIds = (agency && Array.isArray(agency.assignedIds)) ? agency.assignedIds.map(id => Number(id)) : [];
    const pool = employees.filter(e => e && !assignedIds.includes(Number(e.id)));

    poolContainer.innerHTML = "";
    pool.forEach((employee) => {
      const employeeDiv = document.createElement("div");
      employeeDiv.className = "employee";
      employeeDiv.innerHTML = `
        <div class="employee-row">
          <div class="employee-main">
            <strong>${employee.name}</strong> (R${employee.rarity}) • EPS: ${employee.EPS}
          </div>
          <div class="employee-meta">
            <div class="focus-label">Focus: <span class="focus-value">${Math.round(employee.focus)}</span></div>
            <div class="focus-bar" aria-hidden="true">
              <div class="focus-fill ${employee.focus === 0 ? "focus-zero" : (employee.focus <= 20 ? "focus-low" : "")}" style="width:${employee.focus}%;"></div>
            </div>
            <div class="state-label ${employee.state === "malade" ? "state-malade" : (employee.state === "repos" ? "state-repos" : "state-actif")}">État: ${employee.state}</div>
            <div style="margin-top:6px;">
              <button class="assign-btn create-button" data-id="${employee.id}">Assigner</button>
            </div>
          </div>
        </div>
      `;
      poolContainer.appendChild(employeeDiv);
    });

    // attach delegated click handler only once
    if (!poolContainer._assignBound) {
      poolContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".assign-btn");
        if (!btn) return;
        const id = Number(btn.dataset.id);
        if (typeof this.onToggleAssign === "function") this.onToggleAssign(id);
      });
      poolContainer._assignBound = true;
    }
  }

  displayCreateButton(onClick) {
    const button = document.getElementById("create-employee-button");
    if (!button) {
      console.error("Bouton #create-employee-button non trouvé dans le DOM.");
      return;
    }
    button.addEventListener("click", onClick);
  }

  bindToggleAssign(handler) {
    this.onToggleAssign = handler;
  }
}
