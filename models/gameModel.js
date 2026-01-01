import { SaveService } from "../services/saveService.js";
import { Employee } from "./employee.js"; // pour re-hydratation et assign

export class GameModel {
  constructor() {
    this.state = this.getDefaultState();

    const loaded = SaveService.load();
    if (loaded?.state) this.state = this.sanitizeState(loaded.state);
  }

  getDefaultState() {
    return {
      studies: 0,
      employees: [],
      summonsCount: 0,
      stats: {},
      // Agency building state
      agency: {
        level: 1,
        assignedIds: [],       // ids d'employés assignés
        unlockedPlaceholders: [] // placeholder unlocks for odd levels
      }
    };
  }

  sanitizeState(state) {
    const d = this.getDefaultState();

    // employees may be plain objects in save -> try to rehydrate
    const rawEmployees = Array.isArray(state.employees) ? state.employees : [];
    const employees = rawEmployees.map((e) => {
      try {
        if (e && typeof e === "object" && typeof Employee.fromState === "function") {
          return Employee.fromState(e);
        }
      } catch (err) {
        // fallback to raw object
      }
      return e;
    });

    const agency = state.agency ? {
      level: Number(state.agency.level) || d.agency.level,
      assignedIds: Array.isArray(state.agency.assignedIds) ? state.agency.assignedIds.slice() : [],
      unlockedPlaceholders: Array.isArray(state.agency.unlockedPlaceholders) ? state.agency.unlockedPlaceholders.slice() : []
    } : d.agency;

    // Ensure assigned flags reflect assignedIds
    employees.forEach((emp) => {
      if (!emp) return;
      const id = emp.id;
      if (agency.assignedIds.includes(id)) {
        if (typeof emp.setAssigned === "function") emp.setAssigned(true);
        else emp.assigned = true;
      } else {
        if (typeof emp.setAssigned === "function") emp.setAssigned(false);
        else emp.assigned = false;
      }
    });

    return {
      ...d,
      ...state,
      employees,
      stats: typeof state.stats === "object" && state.stats ? state.stats : {},
      agency
    };
  }

  getState() {
    return this.state;
  }

  // Agency helpers
  getAgency() {
    return this.state.agency;
  }

  // slots: 1 at level 1, +1 every EVEN level => slots = 1 + floor(level / 2)
  getAgencySlots() {
    const lvl = Number(this.state.agency.level) || 1;
    return 1 + Math.floor(lvl / 2);
  }

  canAssignMore() {
    return (this.state.agency.assignedIds.length < this.getAgencySlots());
  }

  levelUpAgency() {
    this.state.agency.level = (Number(this.state.agency.level) || 1) + 1;
    // odd levels unlock future buildings (placeholder)
    if (this.state.agency.level % 2 === 1) {
      this.state.agency.unlockedPlaceholders.push(`placeholder-level-${this.state.agency.level}`);
    }
    // persist
    this.save();
  }

  assignEmployeeToAgency(employeeId) {
    // ensure employee exists
    const emp = this.state.employees.find((e) => e && Number(e.id) === Number(employeeId));
    if (!emp) return { ok: false, reason: "employee_not_found" };

    if (this.state.agency.assignedIds.includes(emp.id)) {
      return { ok: false, reason: "already_assigned" };
    }

    if (!this.canAssignMore()) {
      return { ok: false, reason: "no_slots" };
    }

    this.state.agency.assignedIds.push(emp.id);
    if (typeof emp.setAssigned === "function") emp.setAssigned(true);
    else emp.assigned = true;

    this.save();
    return { ok: true };
  }

  unassignEmployeeFromAgency(employeeId) {
    const emp = this.state.employees.find((e) => e && Number(e.id) === Number(employeeId));
    if (!emp) return { ok: false, reason: "employee_not_found" };

    this.state.agency.assignedIds = this.state.agency.assignedIds.filter((id) => Number(id) !== Number(emp.id));
    if (typeof emp.setAssigned === "function") emp.setAssigned(false);
    else emp.assigned = false;

    this.save();
    return { ok: true };
  }

  getAssignedEmployees() {
    const ids = this.state.agency.assignedIds.map((id) => Number(id));
    return this.state.employees.filter((e) => e && ids.includes(Number(e.id)));
  }

  // ----- Currency
  canSpendStudies(amount) {
    return this.state.studies >= amount;
  }

  spendStudies(amount) {
    if (!this.canSpendStudies(amount)) return false;
    this.state.studies -= amount;
    return true;
  }

  addStudies(amount) {
    this.state.studies += amount;
  }

  // ----- EPS (UNIQUEMENT via employés assignés à l'Agency)
  getEps() {
    // EPS total = somme des EPS des employés assignés
    // Si focus > 0 => EPS normal, si focus === 0 => EPS * 0.5
    return this.getAssignedEmployees().reduce((totalEps, e) => {
      if (!e) return totalEps;
      const base = Number(e.EPS) || 0;
      const factor = (typeof e.focus === "number" && e.focus > 0) ? 1 : 0.5;
      // if employee is malade, they produce 0
      if (e.state === "malade") return totalEps;
      return totalEps + base * factor;
    }, 0);
  }

  tick(deltaSeconds) {
    // Focus doit passer de 100 -> 0 en 3600s
    const FOCUS_SECONDS_TO_ZERO = 3600;
    const focusDecreasePerSecond = 100 / FOCUS_SECONDS_TO_ZERO;

    // Probabilité de tomber malade pendant deltaSeconds :
    // 1 chance sur 125 par minute => per-second prob = 1/(125*60)
    const sickProbPerSecond = 1 / (125 * 60);
    const sickProbForInterval = Math.min(1, sickProbPerSecond * deltaSeconds);

    // Ajuster le focus et potentiellement l'état pour chaque employé
    this.state.employees.forEach((e) => {
      if (!e) return;

      // On réduit le focus seulement si l'employé est actif, produit et assigned
      const produces = (Number(e.EPS) || 0) > 0;
      const isActive = e.state === "actif";
      const isAssigned = !!e.assigned;
      if (produces && isActive && isAssigned && typeof e.changeFocus === "function") {
        const deltaFocus = -focusDecreasePerSecond * deltaSeconds;
        e.changeFocus(deltaFocus);
      }

      // Effet aléatoire : chance de tomber malade — uniquement si focus = 0
      const focusIsZero = (typeof e.focus === "number" && e.focus <= 0);
      if (e.state !== "malade" && focusIsZero && Math.random() < sickProbForInterval) {
        if (typeof e.setState === "function") {
          e.setState("malade");
        } else {
          e.state = "malade";
        }
      }
    });

    const eps = this.getEps(); // Calculer EPS total après ajustements
    this.addStudies(eps * deltaSeconds); // Ajouter production à études en temps réel
  }

  // ----- Save
  save() {
    SaveService.save(this.state);
  }

  reset() {
    this.state = this.getDefaultState();
    SaveService.reset();
  }
}
