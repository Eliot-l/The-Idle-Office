import { SaveService } from "../services/saveService.js";

export class GameModel {
  constructor() {
    this.state = this.getDefaultState();

    const loaded = SaveService.load();
    if (loaded?.state) {
      this.state = this.sanitizeState(loaded.state);
    }
  }

  getDefaultState() {
    return {
      studies: 0,
      // Prévu pour la suite (A/B/C) :
      employees: [],          // inventory gacha
      summonsCount: 0,        // coût croissant
      stats: { eps: 0 },      // études / seconde (A)
    };
  }

  sanitizeState(state) {
    // Anti-corruption layer : évite les bugs si save incomplète
    const d = this.getDefaultState();
    return {
      ...d,
      ...state,
      stats: { ...d.stats, ...(state.stats ?? {}) },
      employees: Array.isArray(state.employees) ? state.employees : [],
    };
  }

  getState() {
    return this.state;
  }

  addStudies(amount) {
    this.state.studies += amount;
  }

  save() {
    SaveService.save(this.state);
  }

  reset() {
    this.state = this.getDefaultState();
    SaveService.reset();
  }
}
