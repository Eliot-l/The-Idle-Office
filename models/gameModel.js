import { SaveService } from "../services/saveService.js";

export class GameModel {
  constructor() {
    console.log("Instance de GameModel créée !");
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
    return this.state.employees.reduce((totalEps, e) => totalEps + (e?.EPS || 0), 0);
  }

  tick(deltaSeconds) {
    const eps = this.getEps(); // Calculer EPS total
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
