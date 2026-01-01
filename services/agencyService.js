export class AgencyService {
  constructor(gameModel, notifier = null) {
    this.model = gameModel;
    this.notifier = notifier;
  }

  getSlots() {
    return typeof this.model.getAgencySlots === "function" ? this.model.getAgencySlots() : (1 + Math.floor((Number(this.model.getAgency().level)||1)/2));
  }

  assign(employeeId) {
    const res = this.model.assignEmployeeToAgency(employeeId);
    if (!res.ok && this.notifier) {
      if (res.reason === "no_slots") this.notifier.show("Pas assez de slots dans l'agence.", { type: "warn" });
      else if (res.reason === "already_assigned") this.notifier.show("Employé déjà assigné.", { type: "info" });
      else this.notifier.show("Assignation impossible.", { type: "error" });
    }
    return res;
  }

  unassign(employeeId) {
    const res = this.model.unassignEmployeeFromAgency(employeeId);
    if (!res.ok && this.notifier) this.notifier.show("Impossible de désassigner.", { type: "error" });
    return res;
  }

  levelUp() {
    this.model.levelUpAgency();
    if (this.notifier) this.notifier.show(`Agence niveau ${this.model.getAgency().level}`, { type: "info" });
  }
}
