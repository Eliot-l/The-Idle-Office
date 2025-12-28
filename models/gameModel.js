import { SaveService } from "../services/saveService.js";

export class GameModel {
  constructor() {
    this.state = this.getDefaultState();

    const loaded = SaveService.load();
    if (loaded?.state) this.state = this.sanitizeState(loaded.state);
  }

  getDefaultState() {
    return {
      studies: 0,

      // A (gacha)
      employees: [],       // [{ id, profileId, tier, stats: { production, ... }, traits: [...] }, ...]
      summonsCount: 0,     // pour coût croissant

      // On garde un espace “stats” global pour plus tard (B/C), mais EPS reste dérivé
      stats: {},
    };
  }

  sanitizeState(state) {
    const d = this.getDefaultState();
    return {
      ...d,
      ...state,
      employees: Array.isArray(state.employees) ? state.employees : [],
      stats: typeof state.stats === "object" && state.stats ? state.stats : {},
    };
  }

  getState() {
    return this.state;
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

  // ----- EPS (UNIQUEMENT via employés)
  getEps() {
    // EPS total = somme des EPS de tous les employés
    // Si focus > 0 => EPS normal, si focus === 0 => EPS * 0.5
    return this.state.employees.reduce((totalEps, e) => {
      if (!e) return totalEps;
      const base = Number(e.EPS) || 0;
      const factor = (typeof e.focus === "number" && e.focus > 0) ? 1 : 0.5;
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

      // On réduit le focus seulement si l'employé est actif et produit (EPS > 0)
      const produces = (Number(e.EPS) || 0) > 0;
      const isActive = e.state === "actif";
      if (produces && isActive && typeof e.changeFocus === "function") {
        const deltaFocus = -focusDecreasePerSecond * deltaSeconds;
        e.changeFocus(deltaFocus);
      }

      // Effet aléatoire : chance de tomber malade
      if (e.state !== "malade" && Math.random() < sickProbForInterval) {
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
