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
    // Production = somme des stats.production
    // (on garde le nom "production" pour éviter confusion : c’est ton EPS)
    let eps = 0;
    for (const e of this.state.employees) {
      const p = e?.stats?.production ?? 0;
      if (typeof p === "number" && isFinite(p)) eps += p;
    }
    return Math.max(0, eps);
  }

  // ----- Tick
  tick(deltaSeconds) {
    const eps = this.getEps();
    if (eps <= 0) return;
    this.addStudies(eps * deltaSeconds);
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
