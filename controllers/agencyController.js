import { AgencyView } from "../views/agencyView.js";
import { ModalView } from "../views/modalView.js";

// signature changed: (gameModel, employeeController, agencyService, notifier)
export class AgencyController {
  constructor(gameModel, employeeController, agencyService = null, notifier = null) {
    this.model = gameModel;
    this.employeeController = employeeController;
    this.service = agencyService;
    this.notifier = notifier;
    this.view = new AgencyView();
    this.modal = new ModalView();
  }

  init() {
    this.view.bindLevelUp(() => {
      this.model.levelUpAgency();
      this.refresh();
      this.employeeController.renderEmployees();
    });

    // unassign / details handler
    this.view.bindUnassign((id, opts) => {
      if (opts && opts.details) return this.openEmployeeDetails(id);
      const res = this.service ? this.service.unassign(id) : this.model.unassignEmployeeFromAgency(id);
      if (!res.ok && this.notifier) this.notifier.show("Impossible de désassigner", { type: "error" });
      this.refresh();
      this.employeeController.renderEmployees();
    });

    this.refresh();
  }

  refresh() {
    const agency = this.model.getAgency();
    const assigned = this.model.getAssignedEmployees();
    const slots = this.service ? this.service.getSlots() : (typeof this.model.getAgencySlots === "function" ? this.model.getAgencySlots() : (1 + Math.floor((Number(agency.level)||1)/2)));
    this.view.render(agency, assigned, slots);
  }

  openEmployeeDetails(id) {
    const emp = this.model.getState().employees.find(e => Number(e.id) === Number(id));
    if (!emp) return;
    const html = `
      <h3>${emp.name} (R${emp.rarity})</h3>
      <p>EPS: ${emp.EPS}</p>
      <p>Focus: ${Math.round(emp.focus)}</p>
      <p>État: ${emp.state}</p>
      <div style="margin-top:8px;">
        <button id="modal-unassign" class="create-button">Désassigner</button>
      </div>
    `;
    this.modal.open(html, {
      onClose: () => this.refresh()
    });
    // delegate after short timeout (modal content has just been inserted)
    setTimeout(() => {
      const btn = document.getElementById("modal-unassign");
      if (btn) btn.addEventListener("click", () => {
        this.model.unassignEmployeeFromAgency(id);
        this.modal.close();
        this.refresh();
        this.employeeController.renderEmployees();
      });
    }, 50);
  }
}
